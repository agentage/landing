import fs from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { AUTH_STATE_PATH, USER_RECORD_PATH } from './auth-state.js';

// Signs up an ephemeral user on the live AS (open signup by design, no secrets) and saves its
// session as storageState. The e2e-<run-id>-*@agentage.test shape is what agentage/auth's sweep reaps.
const TARGET = process.env.LANDING_BASE_URL ?? 'https://agentage.io';
const AUTH_URL = process.env.AUTH_URL ?? 'https://auth.agentage.io';
const SCOPE = (process.env.E2E_RUN_ID ?? 'local').replace(/[^a-zA-Z0-9]/g, '');
const EMAIL = `e2e-${SCOPE}-${randomBytes(4).toString('hex')}@agentage.test`;
const PASSWORD = `e2e-Pw-${randomBytes(6).toString('hex')}`;

type ParsedCookie = { name: string; value: string; domain: string };

const parseSetCookie = (line: string): ParsedCookie => {
  const [pair, ...attrs] = line.split(';');
  const eq = pair.indexOf('=');
  const domainAttr = attrs.map((a) => a.trim()).find((a) => a.toLowerCase().startsWith('domain='));
  return {
    name: pair.slice(0, eq).trim(),
    value: pair.slice(eq + 1).trim(),
    domain: domainAttr ? domainAttr.slice('domain='.length) : '.agentage.io',
  };
};

export default async function globalSetup(): Promise<void> {
  const target = new URL(TARGET);
  if (!/(^|\.)agentage\.io$/.test(target.hostname)) {
    throw new Error(`[post-deploy] ${target.hostname} is not *.agentage.io: cookie cannot carry`);
  }

  const res = await fetch(`${AUTH_URL}/api/auth/sign-up/email`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: target.origin,
      'x-client-type': 'test',
    },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD, name: EMAIL.split('@')[0] }),
  });
  if (!res.ok) {
    throw new Error(
      `[post-deploy] sign-up failed ${res.status}: ${(await res.text()).slice(0, 200)}`
    );
  }
  const cookies = res.headers
    .getSetCookie()
    .map(parseSetCookie)
    .filter((c) => c.name && c.value);
  if (!cookies.some((c) => c.name.includes('session_token'))) {
    throw new Error('[post-deploy] sign-up returned no session cookie');
  }

  const storageState = {
    cookies: cookies.map((c) => ({
      name: c.name,
      value: c.value,
      domain: c.domain,
      path: '/',
      expires: Math.floor(Date.now() / 1000) + 60 * 60,
      httpOnly: true,
      secure: true,
      sameSite: 'Lax' as const,
    })),
    origins: [],
  };
  fs.mkdirSync(path.dirname(AUTH_STATE_PATH), { recursive: true });
  fs.writeFileSync(AUTH_STATE_PATH, JSON.stringify(storageState, null, 2));
  fs.writeFileSync(USER_RECORD_PATH, JSON.stringify({ email: EMAIL }));
  console.log(`[post-deploy] ephemeral user ${EMAIL} vs ${target.origin}`);
}

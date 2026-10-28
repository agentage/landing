import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SignJWT, exportJWK, generateKeyPair } from 'jose';
import {
  _clearSessionCache,
  deriveAuthBase,
  evictSession,
  getSession,
  sessionCacheKey,
} from './auth';

describe('deriveAuthBase', () => {
  it('derives the auth sibling from a prod apex FQDN', () => {
    expect(deriveAuthBase('agentage.io')).toBe('https://auth.agentage.io');
  });

  it('keeps the dev prefix (dev.agentage.io -> auth.dev.agentage.io)', () => {
    expect(deriveAuthBase('dev.agentage.io')).toBe('https://auth.dev.agentage.io');
  });

  it('tolerates a scheme / trailing slash / case on the FQDN', () => {
    expect(deriveAuthBase('https://Agentage.io/')).toBe('https://auth.agentage.io');
  });

  it('prefers an explicit AUTH_URL over the derived host', () => {
    expect(deriveAuthBase('agentage.io', 'https://auth.example.test/')).toBe(
      'https://auth.example.test'
    );
  });

  it('returns null for localhost / 127.0.0.1 / empty / .invalid (signed-out)', () => {
    for (const h of ['localhost', 'localhost:3000', '127.0.0.1', '', undefined, 'x.invalid']) {
      expect(deriveAuthBase(h)).toBeNull();
    }
  });
});

describe('sessionCacheKey', () => {
  it('picks the session_token pair, ignoring analytics cookies', () => {
    expect(sessionCacheKey('a=1; better-auth.session_token=X; _ga=2')).toBe(
      'better-auth.session_token=X'
    );
  });

  it('handles the __Secure- prefixed name', () => {
    expect(sessionCacheKey('_ga=1; __Secure-better-auth.session_token=X')).toBe(
      '__Secure-better-auth.session_token=X'
    );
  });

  it('falls back to the raw header without a session cookie', () => {
    expect(sessionCacheKey('sess=1; _ga=2')).toBe('sess=1; _ga=2');
  });
});

describe('getSession cache vs cookie churn', () => {
  const AS = 'https://auth.agentage.io';
  const env = { ...process.env };
  let mints: number;
  let mintStatus: number;
  let jwks: unknown;
  let token: string;

  beforeEach(async () => {
    process.env.AUTH_URL = AS;
    delete process.env.SITE_FQDN;
    _clearSessionCache();
    const { publicKey, privateKey } = await generateKeyPair('RS256');
    jwks = { keys: [{ ...(await exportJWK(publicKey)), kid: 'k1', alg: 'RS256', use: 'sig' }] };
    token = await new SignJWT({ email: 'a@b.co' })
      .setProtectedHeader({ alg: 'RS256', kid: 'k1' })
      .setSubject('u1')
      .setIssuer(AS)
      .setAudience(AS)
      .setExpirationTime('10m')
      .sign(privateKey);
    mints = 0;
    mintStatus = 200;
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.endsWith('/api/auth/jwks')) return Response.json(jwks);
        mints++;
        return mintStatus === 200 ? Response.json({ token }) : new Response('', { status: 401 });
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env = { ...env };
  });

  it.each(['session_token', '__Secure-better-auth.session_token'])(
    'sign-out with analytics cookies evicts the entry cached without them (%s)',
    async (name) => {
      expect((await getSession(`${name}=X`))?.sub).toBe('u1');
      expect(mints).toBe(1);

      evictSession(`${name}=X; _ga=1`);
      mintStatus = 401;
      expect(await getSession(`${name}=X`)).toBeNull();
      expect(mints).toBe(2);
    }
  );

  it('analytics cookie churn on reads hits the same cache entry', async () => {
    await getSession('session_token=X');
    await getSession('session_token=X; _ga=1');
    await getSession('_ga=2; session_token=X; _ga_ABC=3');
    expect(mints).toBe(1);
  });
});

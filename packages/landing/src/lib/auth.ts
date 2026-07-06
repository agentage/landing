import { createRemoteJWKSet, jwtVerify, errors as joseErrors } from 'jose';

// BFF session resolver. Shared-cookie SSO: the Better Auth AS sets the session
// cookie with Domain=.agentage.io (dev .dev.agentage.io), so the apex landing host
// receives it. This module forwards the RAW Cookie header to the AS to MINT a
// short-lived session JWT (GET /api/auth/token), then VERIFIES that JWT LOCALLY
// against the AS JWKS - the platform two-token model: the AS is hit at most once per
// token lifetime per cookie, and the trust anchor is a signature, not live
// introspection. The three-way outcome mirrors agentage/mcp-catalog lib/auth.ts. We
// never parse a cookie name - the prod cookie is `__Secure-` prefixed, so name
// matching is fragile; the AS reads it.

// Explicit AUTH_URL wins; otherwise derive the sibling AS host from the site FQDN.
// Landing runs on the apex (agentage.io / dev.agentage.io), so the AS is the
// `auth.` sibling (auth.agentage.io / auth.dev.agentage.io). Unresolvable
// (localhost / no env) -> null = signed-out.
export function deriveAuthBase(siteFqdn?: string, authUrl?: string): string | null {
  const explicit = (authUrl ?? '').trim().replace(/\/+$/, '');
  if (explicit) return explicit;
  const fqdn = (siteFqdn ?? '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/+$/, '');
  if (
    !fqdn ||
    fqdn.startsWith('localhost') ||
    fqdn.startsWith('127.0.0.1') ||
    fqdn.endsWith('.invalid')
  ) {
    return null;
  }
  return `https://auth.${fqdn}`;
}

export function resolveAuthBase(): string | null {
  return deriveAuthBase(process.env.SITE_FQDN, process.env.AUTH_URL);
}

export interface Session {
  sub: string;
  email: string;
  name?: string;
}

// A transient AS failure (throttle / 5xx / network / JWKS timeout) is OUR problem,
// not a signed-out user - the caller must retry, never render a logged-out UI.
export class SessionUnavailableError extends Error {
  constructor(message = 'auth service unavailable') {
    super(message);
    this.name = 'SessionUnavailableError';
  }
}

// Re-mint this far before the JWT exp so a cached token is never served on the edge
// of expiry (a within-skew token risks a spurious expired-verify sign-out).
const REMINT_SKEW_MS = 30_000;

const asString = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined);

// One JWKSet per JWKS URL: jose caches the fetched keys on the instance and only
// refetches on a cooldown, so reuse is what keeps verification local (no per-call
// fetch). Module-level, safe per node process.
const jwksByUrl = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function jwksFor(jwksUrl: string): ReturnType<typeof createRemoteJWKSet> {
  let set = jwksByUrl.get(jwksUrl);
  if (!set) {
    set = createRemoteJWKSet(new URL(jwksUrl), { timeoutDuration: 4000 });
    jwksByUrl.set(jwksUrl, set);
  }
  return set;
}

interface TokenEntry {
  token: string;
  expMs: number;
}

// Cache the MINTED token per raw cookie until its exp so the AS is hit once per
// token lifetime; verification itself runs locally on every call.
const tokenCache = new Map<string, TokenEntry>();

// Test hook: drop cached tokens AND memoized JWKS between cases.
export function _clearSessionCache(): void {
  tokenCache.clear();
  jwksByUrl.clear();
}

type MintResult = { kind: 'token'; token: string } | { kind: 'anon' } | { kind: 'transient' };

// Mint a session JWT from the forwarded cookie. 200 { token } -> mint; 401/no-token
// = signed-out (anon); 429 / 5xx / network = transient (retryable, never a sign-out).
async function mintSessionJwt(authBase: string, cookie: string): Promise<MintResult> {
  let res: Response;
  try {
    res = await fetch(`${authBase}/api/auth/token`, {
      headers: { cookie, accept: 'application/json' },
      cache: 'no-store',
    });
  } catch {
    return { kind: 'transient' };
  }
  if (res.status === 429 || res.status >= 500) return { kind: 'transient' };
  if (!res.ok) return { kind: 'anon' };
  const body = (await res.json().catch(() => null)) as { token?: string } | null;
  if (!body?.token) return { kind: 'anon' };
  return { kind: 'token', token: body.token };
}

type VerifyResult =
  { kind: 'valid'; claims: Session; expMs: number } | { kind: 'invalid' } | { kind: 'transient' };

// Local JWKS verification: valid claims / definitively-bad token (any JOSEError:
// expired, bad signature, no matching key) -> invalid / JWKS timeout or network blip
// -> transient (must NEVER read as a sign-out). issuer + audience both = the AS origin.
async function verifySessionJwt(authBase: string, token: string): Promise<VerifyResult> {
  try {
    const { payload } = await jwtVerify(token, jwksFor(`${authBase}/api/auth/jwks`), {
      issuer: authBase,
      audience: authBase,
    });
    const sub = asString(payload.sub);
    const email = asString(payload.email);
    if (!sub || !email) return { kind: 'invalid' };
    const expMs = typeof payload.exp === 'number' ? payload.exp * 1000 : 0;
    return { kind: 'valid', claims: { sub, email, name: asString(payload.name) }, expMs };
  } catch (err) {
    if (err instanceof joseErrors.JWKSTimeout) return { kind: 'transient' };
    if (err instanceof joseErrors.JOSEError) return { kind: 'invalid' };
    return { kind: 'transient' };
  }
}

// Resolve the shared-cookie session. Mints (or reuses a cached) session JWT and
// verifies it locally. valid -> claims; signed-out -> null; transient AS / JWKS
// failure -> throws SessionUnavailableError.
export async function getSession(cookieHeader: string | null): Promise<Session | null> {
  const cookie = cookieHeader?.trim();
  if (!cookie) return null;

  const authBase = resolveAuthBase();
  if (!authBase) return null;

  const now = Date.now();
  const hit = tokenCache.get(cookie);
  let token: string;
  if (hit && hit.expMs - REMINT_SKEW_MS > now) {
    token = hit.token;
  } else {
    tokenCache.delete(cookie);
    const minted = await mintSessionJwt(authBase, cookie);
    if (minted.kind === 'transient') {
      throw new SessionUnavailableError('auth service temporarily unavailable');
    }
    if (minted.kind === 'anon') return null;
    token = minted.token;
  }

  const verified = await verifySessionJwt(authBase, token);
  if (verified.kind === 'transient') {
    throw new SessionUnavailableError('auth service temporarily unavailable');
  }
  if (verified.kind === 'invalid') {
    tokenCache.delete(cookie);
    return null;
  }
  if (verified.expMs > now) tokenCache.set(cookie, { token, expMs: verified.expMs });
  return verified.claims;
}

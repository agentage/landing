import { getSession, resolveAuthBase, SessionUnavailableError } from '@/lib/auth';
import type { SessionResponse } from '@/lib/session';

// BFF session endpoint for the header AccountMenu. Reads the shared-cookie session.
// Always dynamic + no-store + noindex: per-user data must never ride the CDN cache
// or be indexed. Keeping this the only dynamic surface leaves the marketing pages
// static (the island fetches this after hydration).
export const dynamic = 'force-dynamic';

const NO_STORE = {
  'cache-control': 'no-store',
  'x-robots-tag': 'noindex',
} as const;

// Local-dev AS port (matches the shared topology). Only used when no runtime auth
// host resolves (localhost) so the signed-out "Sign in" link still renders; prod
// and dev always resolve auth.<domain> via SITE_FQDN.
const LOCAL_SIGN_IN = 'http://localhost:3010/sign-in';

function signInHref(): string {
  const base = resolveAuthBase();
  return base ? `${base}/sign-in` : LOCAL_SIGN_IN;
}

export async function GET(req: Request): Promise<Response> {
  const cookieHeader = req.headers.get('cookie');

  let session;
  try {
    session = await getSession(cookieHeader);
  } catch (err) {
    // Transient AS failure is OUR problem, not a signed-out user - 503 so the client
    // keeps the slot empty and retries, never flashing a logged-out header.
    if (err instanceof SessionUnavailableError) {
      return Response.json({ error: 'auth_unavailable' }, { status: 503, headers: NO_STORE });
    }
    throw err;
  }

  const body: SessionResponse = {
    user: session ? { email: session.email, name: session.name } : null,
    signInUrl: signInHref(),
  };
  return Response.json(body, { headers: NO_STORE });
}

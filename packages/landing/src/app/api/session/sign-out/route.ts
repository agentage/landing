import { resolveAuthBase } from '@/lib/auth';

// Sign-out proxy. The browser never POSTs the AS cross-origin: instead it POSTs here
// same-origin, we forward the Cookie to the AS sign-out, and RELAY the AS Set-Cookie
// clearing headers back. The clear carries Domain=.<registrable-domain>, so it
// applies across every sibling host (apex + dashboard + catalog).
export const dynamic = 'force-dynamic';

const NO_STORE = { 'cache-control': 'no-store' } as const;

// The public host: the Traefik-forwarded Host header, or the request URL host.
function requestHost(req: Request): string | null {
  const header = req.headers.get('host');
  if (header) return header;
  try {
    return new URL(req.url).host;
  } catch {
    return null;
  }
}

// Same-origin gate, like any state-changing write: a foreign Origin is rejected.
// A missing Origin (some same-origin agents omit it) is allowed.
function isForeignOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return false;
  try {
    return new URL(origin).host !== requestHost(req);
  } catch {
    return true;
  }
}

export async function POST(req: Request): Promise<Response> {
  if (isForeignOrigin(req)) {
    return Response.json({ error: 'forbidden' }, { status: 403, headers: NO_STORE });
  }

  const authBase = resolveAuthBase();
  // No runtime AS (localhost dev): nothing to clear upstream - report success.
  if (!authBase) {
    return Response.json({ ok: true }, { headers: NO_STORE });
  }

  const cookie = req.headers.get('cookie') ?? '';
  let upstream: Response;
  try {
    upstream = await fetch(`${authBase}/api/auth/sign-out`, {
      method: 'POST',
      headers: { cookie, accept: 'application/json' },
    });
  } catch {
    return Response.json({ error: 'auth_unavailable' }, { status: 502, headers: NO_STORE });
  }

  const headers = new Headers(NO_STORE);
  for (const setCookie of upstream.headers.getSetCookie()) {
    headers.append('set-cookie', setCookie);
  }
  return new Response(null, { status: upstream.ok ? 200 : 502, headers });
}

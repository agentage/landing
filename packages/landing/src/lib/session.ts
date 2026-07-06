// Client-safe session contract shared by the /api/session route, its unit tests,
// and the AccountMenu island. Types + pure helpers only (no server imports), so the
// client bundle can import it. Landing has no basePath, so fetch URLs are bare.
export const SESSION_API = '/api/session';
export const SIGN_OUT_API = '/api/session/sign-out';

export interface SessionUser {
  email: string;
  name?: string;
}

// The BFF session envelope. `user` null = signed-out; `signInUrl` is the runtime
// AS sign-in base (SITE_FQDN -> auth.<domain>/sign-in) resolved by the route handler
// (the one always-dynamic surface with runtime env); the client appends `?next=`.
export interface SessionResponse {
  user: SessionUser | null;
  signInUrl: string;
}

// Append the current URL as `?next=` so the AS returns the user here post-login;
// SSR-safe (no window) - it just yields the bare base until hydrated.
export function signInHref(base: string): string {
  if (typeof window === 'undefined') return base;
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}next=${encodeURIComponent(window.location.href)}`;
}

// The MCP catalog favorites page lives on the sibling catalog host under /mcp.
// Derived client-side from the current hostname (marketing pages are static, so the
// runtime SITE_FQDN never reaches the client): agentage.io -> catalog.agentage.io,
// dev.agentage.io -> catalog.dev.agentage.io; localhost -> the local catalog dev.
export function catalogFavoritesUrl(hostname: string): string {
  const host = hostname.trim().toLowerCase();
  if (!host || host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:3000/mcp/favorites';
  }
  return `https://catalog.${host}/mcp/favorites`;
}

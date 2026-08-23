import { docsHost } from '@agentage/shared';

/**
 * Host-based docs routing for the one landing container.
 *
 * docs.<apex> serves the docs tree at its root (`/` is the docs index, `/<slug>`
 * a page) while the apex 308s its legacy `/docs*` URLs over to it. Pure string
 * logic so `middleware.ts` stays a thin adapter and this stays unit-testable.
 */

export interface DocsHostRouting {
  apexHost: string;
  docsHost: string;
}

// Paths that mean the same thing on every host and must never gain a /docs prefix:
// framework internals, API routes, and the site-wide metadata/asset routes.
const SHARED_PREFIX =
  /^\/(_next|api|schemas|\.well-known|health|opengraph-image|twitter-image|icon|apple-icon|mcp-registry-auth)(\/|$)/;

// A dotted last segment is a static asset (favicon.ico, robots.txt, sitemap.xml,
// logo.png). The .md mirrors are the exception: they are docs content.
const isAssetPath = (pathname: string): boolean => {
  const last = pathname.slice(pathname.lastIndexOf('/') + 1);
  return last.includes('.') && !last.endsWith('.md');
};

/** True when the path is served identically on the apex and the docs host. */
export const isSharedPath = (pathname: string): boolean =>
  SHARED_PREFIX.test(pathname) || isAssetPath(pathname);

/** Apex + docs hostnames, or undefined when there is no host split (local dev). */
export const docsHostRouting = (siteFqdn?: string): DocsHostRouting | undefined => {
  const docs = docsHost(siteFqdn);
  if (!docs) return undefined;
  return { apexHost: docs.slice('docs.'.length), docsHost: docs };
};

/** Internal path a docs-host request rewrites to, or undefined to serve it as-is. */
export const docsRewritePath = (pathname: string): string | undefined => {
  if (isSharedPath(pathname)) return undefined;
  if (pathname === '/') return '/docs';
  // Already docs-scoped (/docs, /docs/x, /docs.md, /docs-md/x) - never double-prefix.
  if (pathname.startsWith('/docs')) return undefined;
  return `/docs${pathname}`;
};

/** Docs-host path an apex /docs URL redirects to, or undefined to serve it as-is. */
export const apexDocsRedirectPath = (pathname: string): string | undefined => {
  if (pathname === '/docs') return '/';
  if (pathname.startsWith('/docs/')) return pathname.slice('/docs'.length);
  // The index markdown mirror keeps its path; the docs host serves it unrewritten.
  if (pathname === '/docs.md') return pathname;
  return undefined;
};

/** Absolute URL of a doc page under `base` ('' is the index). */
export const docUrl = (base: string, slug: string): string =>
  slug === '' ? base : `${base.replace(/\/+$/, '')}/${slug}`;

/** Absolute URL of a doc page's markdown mirror under `base`. */
export const docMdUrl = (base: string, slug: string): string =>
  // The index mirror is a host-root route (/docs.md) on both the apex and the docs host.
  slug === '' ? `${new URL(base).origin}/docs.md` : `${docUrl(base, slug)}.md`;

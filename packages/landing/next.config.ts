import type { NextConfig } from 'next';

// Same derivation as `links()` in @agentage/shared, spelled out because next.config is
// loaded by Next's own CJS config loader, which cannot resolve that package's ESM-only
// export. Keep it in step with origins.ts if the host scheme ever changes.
const fqdn = (process.env.NEXT_PUBLIC_SITE_FQDN ?? '').trim().replace(/^https?:\/\//, '');
const API_URL =
  !fqdn || fqdn.startsWith('localhost') || fqdn.startsWith('127.0.0.1')
    ? 'http://localhost:3001/api'
    : `https://api.${fqdn}/api`;

const nextConfig: NextConfig = {
  output: 'standalone',
  // Server maps make prod stack traces point at src, not the minified bundle.
  experimental: { serverSourceMaps: true },
  async redirects() {
    return [
      // Short link to the generic connect guide.
      { source: '/connect', destination: '/docs/connect', permanent: true },
      // The MCP directory lives on its own host; keep the advertised apex path working.
      { source: '/mcp', destination: 'https://catalog.agentage.io/mcp', permanent: true },
      {
        source: '/mcp/:path*',
        destination: 'https://catalog.agentage.io/mcp/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    // Static JSON Schema artifacts under public/schemas are inert and cacheable.
    return [
      {
        source: '/schemas/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600' }],
      },
    ];
  },
  async rewrites() {
    // The waitlist/unsubscribe calls hit the API host directly (api.<fqdn>/api,
    // cross-origin) - see lib/site.ts - so no general same-origin /api proxy lives here.
    return [
      // ONE exception, and it is about mail already delivered: every waitlist email sent
      // before web#480 carries an RFC 8058 List-Unsubscribe header pointing at this apex
      // path, which the app answers with a 404 - so those one-click unsubscribes silently
      // fail. New mail points at the API host; this keeps the old headers honest. A
      // recipient's right to leave outlives our routing decisions, so it does not expire.
      { source: '/api/waitlist/unsubscribe', destination: `${API_URL}/waitlist/unsubscribe` },
      // Serve the MCP-registry domain-verification file at its well-known path off a plain route (leading-dot app segments are unreliable across Next).
      { source: '/.well-known/mcp-registry-auth', destination: '/mcp-registry-auth' },
      // /blog/<slug>.md → markdown mirror for agents (route handler at /blog-md/<slug>).
      { source: '/blog/:slug.md', destination: '/blog-md/:slug' },
      // /docs/<slug>.md → per-page markdown mirror (route handler at /docs-md/<slug>).
      { source: '/docs/:slug.md', destination: '/docs-md/:slug' },
    ];
  },
};

export default nextConfig;

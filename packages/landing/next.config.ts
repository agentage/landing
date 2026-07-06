import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  async redirects() {
    // Short link to the generic connect guide.
    return [{ source: '/connect', destination: '/docs/connect', permanent: true }];
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
    // The waitlist/unsubscribe calls now hit the API host directly (api.<fqdn>/api,
    // cross-origin) - see lib/site.ts - so no same-origin /api proxy is needed here.
    return [
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

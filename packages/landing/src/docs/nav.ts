import type { DocNavGroup } from './types';
import { clientNavItems } from './content/clients';

// Sidebar nav. Items with a `slug` link to a real page; `comingSoon` items are
// intentional stubs - add the page, give it a slug, drop the flag.
export const docsNav: DocNavGroup[] = [
  {
    title: 'Get started',
    items: [
      { label: 'Overview', slug: '' },
      { label: 'MCP server', slug: 'mcp-server' },
    ],
  },
  {
    // Generic guide first, then one item per client.
    title: 'Connect your client',
    items: [{ label: 'Any client', slug: 'connect' }, ...clientNavItems],
  },
  {
    title: 'Reference',
    items: [
      { label: 'REST API', slug: 'rest-api' },
      { label: 'MCP tools', slug: 'mcp-tools' },
      { label: 'CLI', slug: 'cli' },
      { label: 'Local API', slug: 'local-api' },
    ],
  },
];

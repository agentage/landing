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
    // One item per client - connect them one by one.
    title: 'Connect your client',
    items: clientNavItems,
  },
  {
    title: 'Reference',
    items: [
      { label: 'CLI', comingSoon: true },
      { label: 'MCP tools', comingSoon: true },
    ],
  },
];

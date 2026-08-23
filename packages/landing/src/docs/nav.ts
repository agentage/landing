import type { DocNavGroup } from './types';
import { clientNavItems } from './content/clients';

// Sidebar nav, grouped by product area. Items with a `slug` link to a real page;
// `comingSoon` items are intentional stubs - add the page, give it a slug, drop
// the flag. An item may carry nested `items` (one level) for its sub-pages.
export const docsNav: DocNavGroup[] = [
  {
    title: 'Get started',
    items: [
      { label: 'Overview', slug: '' },
      { label: 'MCP server', slug: 'mcp-server' },
    ],
  },
  {
    title: 'Memory',
    items: [
      // The generic guide is the parent; each client page nests under it.
      { label: 'Connect a client', slug: 'connect', items: clientNavItems },
      { label: 'Prompt examples', slug: 'prompt-examples' },
      { label: 'MCP tools', slug: 'mcp-tools' },
      { label: 'REST API', slug: 'rest-api' },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { label: 'Catalog MCP', comingSoon: true },
      { label: 'Catalog API', comingSoon: true },
    ],
  },
  {
    title: 'Tools',
    items: [
      { label: 'CLI', slug: 'cli' },
      { label: 'Local API', slug: 'local-api' },
    ],
  },
  {
    title: 'Resources',
    items: [{ label: 'Troubleshoot', comingSoon: true }],
  },
];

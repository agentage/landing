import type { DocPage } from '../types';

// Docs index ('/') - about the project. Positioning + facts mirror the landing
// canonical copy (agentage/landing .../lib/mcp-docs.ts: DOCS_INTRO).
export const overviewDoc: DocPage = {
  slug: '',
  title: 'Agentage Memory',
  lede: 'One memory. Every AI. Owned by you. A shared markdown memory that all of your AI tools read and write through a single MCP endpoint.',
  keywords: [
    'one memory every AI',
    'cross-vendor AI memory',
    'files-first memory',
    'own your AI memory',
    'Claude ChatGPT Cursor memory',
  ],
  sections: [
    {
      id: 'what-it-is',
      title: 'What it is',
      blocks: [
        {
          type: 'p',
          md: 'Agentage Memory is a single, portable memory that every AI you use can read and write. Connect any MCP client - Claude, Claude Code, Cursor, VS Code, ChatGPT - to one shared markdown memory through a single endpoint. Sign in with OAuth and your AI tools read and write the same notes, so context follows you between tools instead of being trapped in one.',
        },
        {
          type: 'p',
          md: 'Your notes are plain markdown, addressed by path (e.g. `work/tasks/foo.md`) and stored in the EU. You can browse them in the dashboard, search them from any AI, and export the whole thing at any time.',
        },
      ],
    },
    {
      id: 'why',
      title: 'Why it is different',
      blocks: [
        {
          type: 'p',
          md: 'Memory features baked into a single assistant are closed and vendor-locked - what Claude remembers, ChatGPT cannot see. Agentage Memory is the opposite:',
        },
        {
          type: 'p',
          md: '- **Cross-vendor** - the same memory works across every AI tool you use, not just one.\n- **Files-first** - the source of truth is markdown you own, mirrored locally and exportable anytime.\n- **No lock-in** - open MCP standard, no proprietary database, no API keys to manage.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'One memory per account',
          md: 'Connect the same account in each client to share one memory across all of them. Data is stored in the EU and exportable anytime.',
        },
      ],
    },
    {
      id: 'how-it-works',
      title: 'How it works',
      blocks: [
        {
          type: 'p',
          md: 'Every connected AI talks to one cloud **MCP server** over a single endpoint, using six tools to search, read, and write your notes. Clients authenticate with OAuth - sign in once in the browser, no API key.',
        },
        {
          type: 'callout',
          variant: 'success',
          title: 'Next: connect the MCP server',
          md: 'Head to the **[MCP server](/docs/mcp-server)** page for the endpoint, the tools, and one-click setup for Claude, VS Code, Cursor, and ChatGPT.',
        },
      ],
    },
  ],
};

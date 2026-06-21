import type { DocPage } from '../types';
import { MCP_ENDPOINT_URL as ENDPOINT } from '@/lib/mcp-docs';
import { clientLinksMd } from './clients';

// MCP server page - the hub: endpoint, how to pick a client, tools, limitations.
// Per-client setup lives on the dedicated client pages (see content/clients.ts).
export const mcpServerDoc: DocPage = {
  slug: 'mcp-server',
  title: 'MCP server',
  lede: 'One cloud endpoint that every AI tool connects to over the Model Context Protocol. Sign in with OAuth - no API key - and read and write your memory through six tools.',
  keywords: [
    'MCP server',
    'MCP endpoint',
    'Streamable HTTP MCP',
    'OAuth 2.1 MCP',
    'memory tools',
    'memory__search',
  ],
  sections: [
    {
      id: 'endpoint',
      title: 'The endpoint',
      blocks: [
        {
          type: 'p',
          md: 'Agentage Memory exposes a single MCP endpoint over **Streamable HTTP**:',
        },
        {
          type: 'code',
          language: 'text',
          code: ENDPOINT,
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Auth: OAuth 2.1, no API key',
          md: 'Clients authenticate with **OAuth 2.1** (PKCE + dynamic client registration) - sign in once in the browser, no API key to copy or leak. The same account in every client shares one memory.',
        },
      ],
    },
    {
      id: 'connect-your-client',
      title: 'Connect your client',
      blocks: [
        {
          type: 'p',
          md: `The same endpoint works across every MCP client. Pick yours - each has a one-click install and a manual config:\n\n${clientLinksMd}`,
        },
      ],
    },
    {
      id: 'tools',
      title: 'Tools',
      blocks: [
        {
          type: 'p',
          md: 'Once connected, every client gets the same six memory operations:\n\n| Tool | What it does |\n| --- | --- |\n| `memory__search` | Find notes by keyword across the whole memory. |\n| `memory__read` | Read a note by path. |\n| `memory__write` | Create or replace a note. |\n| `memory__edit` | Apply a targeted edit to a note. |\n| `memory__list` | Browse the folder tree - subfolders with file counts, two levels deep. |\n| `memory__delete` | Remove a note (recoverable soft-delete). |',
        },
        {
          type: 'callout',
          variant: 'info',
          md: 'The memory tools run only when your request is about your notes - everyday questions like facts, math, or writing are answered normally, without touching your memory.',
        },
      ],
    },
    {
      id: 'try-it',
      title: 'Try it',
      blocks: [
        {
          type: 'steps',
          steps: [
            {
              title: 'Search and read',
              body: '_"Search my memory for postgres and read the top result."_ → ranks notes by match count, then returns the top note in full. (`memory__search → memory__read`)',
            },
            {
              title: 'Write a note',
              body: '_"Save a note at projects/acme/stack.md: we use Postgres for full-text search."_ → creates the note; readable from every AI on the same account. (`memory__write`)',
            },
            {
              title: 'List and tag',
              body: '_"List everything under projects/ and tag the roadmap note as launched."_ → shows the folder tree, then merges a tag into the note frontmatter. (`memory__list → memory__edit`)',
            },
          ],
        },
      ],
    },
    {
      id: 'limitations',
      title: 'Limitations',
      blocks: [
        {
          type: 'p',
          md: '- Notes are plain markdown addressed by **path** (e.g. `work/tasks/foo.md`), not by title or ID.\n- Search is literal keyword/substring matching - not semantic or vector search; search one distinctive keyword, not a phrase.\n- `search` returns ranked paths + snippets, never full bodies - use `read` for the whole note.\n- `list` shows the folder tree two levels deep, up to 100 entries per folder - call it again with a subfolder to go deeper.\n- `edit` shallow-merges top-level frontmatter keys and cannot remove a key; use `write` to fully replace a note.\n- `delete` is a recoverable soft-delete (kept in history), not a hard wipe.',
        },
      ],
    },
  ],
};

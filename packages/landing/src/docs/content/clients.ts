import type { DocNavItem, DocPage } from '../types';
import {
  CHATGPT_CONNECTORS_URL,
  CLAUDE_ADD_URL,
  CURSOR_ADD_URL,
  MCP_ENDPOINT_URL as ENDPOINT,
  VSCODE_ADD_URL,
} from '@/lib/mcp-docs';

// One entry per MCP client. Each becomes its own doc page (a "Connect your
// client" leaf) and a sidebar nav item. Setup copy mirrors the canonical
// CLIENT_GUIDES in agentage/landing .../lib/mcp-docs.ts.
interface ClientDef {
  /** URL slug + nav order. */
  slug: string;
  /** Sidebar label (kept short). */
  nav: string;
  /** Page H1. */
  title: string;
  lede: string;
  /** Markdown setup instructions. */
  setup: string;
}

const CLIENTS: ClientDef[] = [
  {
    slug: 'claude-code',
    nav: 'Claude Code',
    title: 'Claude Code',
    lede: 'Add the memory server from the terminal, then sign in with OAuth.',
    setup: `Run:

\`\`\`bash
claude mcp add --transport http memory ${ENDPOINT}
\`\`\`

Then run \`/mcp\` and complete the OAuth sign-in. A connector you add in [Claude.ai](https://claude.ai) also syncs here automatically.`,
  },
  {
    slug: 'claude',
    nav: 'Claude',
    title: 'Claude (Desktop & claude.ai)',
    lede: 'Add Agentage Memory as a custom connector in Claude Desktop or claude.ai.',
    setup: `**One-click:** [Add to Claude](${CLAUDE_ADD_URL}) - opens with the server prefilled; review, confirm, and sign in.

**Manual:** Settings → Connectors → Add custom connector, paste \`${ENDPOINT}\`.`,
  },
  {
    slug: 'vs-code',
    nav: 'VS Code',
    title: 'VS Code',
    lede: 'Install the memory server in VS Code with one click or a small config file.',
    setup: `**One-click:** [Install in VS Code](${VSCODE_ADD_URL})

**Manual:** add the server to \`.vscode/mcp.json\` (or run the \`MCP: Add Server\` command):

\`\`\`json
{
  "servers": {
    "agentage-memory": {
      "type": "http",
      "url": "${ENDPOINT}"
    }
  }
}
\`\`\`

VS Code opens the browser for the OAuth sign-in on first use.`,
  },
  {
    slug: 'cursor',
    nav: 'Cursor',
    title: 'Cursor',
    lede: 'Add the memory server to Cursor with a deeplink or its MCP config.',
    setup: `**One-click:** [Add to Cursor](${CURSOR_ADD_URL}), then sign in when prompted.

**Manual:** add \`{ "url": "${ENDPOINT}" }\` to \`~/.cursor/mcp.json\`.`,
  },
  {
    slug: 'chatgpt',
    nav: 'ChatGPT',
    title: 'ChatGPT',
    lede: 'Add Agentage Memory as a custom connector (paid plans, Developer Mode).',
    setup: `Open [Settings → Apps & Connectors](${CHATGPT_CONNECTORS_URL}) → Advanced settings → enable Developer Mode → Create (paid plans, not Free; ChatGPT has no one-click link, so add it by hand).

Paste \`${ENDPOINT}\` and sign in when prompted.`,
  },
  {
    slug: 'grok',
    nav: 'Grok',
    title: 'Grok',
    lede: 'Add Agentage Memory to Grok by pasting the MCP server URL.',
    setup: `In Grok, add a custom MCP server and paste the endpoint URL:

\`\`\`text
${ENDPOINT}
\`\`\`

Grok opens the browser for the OAuth sign-in on first use - no API key.`,
  },
];

const clientHref = (slug: string): string => `/docs/${slug}`;

export const clientDocs: DocPage[] = CLIENTS.map((c) => ({
  slug: c.slug,
  title: c.title,
  lede: c.lede,
  keywords: [c.nav, `${c.nav} MCP`, `connect ${c.nav}`, `${c.nav} memory`, `${c.nav} MCP server`],
  sections: [
    {
      id: 'setup',
      title: 'Setup',
      blocks: [{ type: 'p', md: c.setup }],
    },
    {
      id: 'whats-next',
      title: 'What you get',
      blocks: [
        {
          type: 'callout',
          variant: 'info',
          md: `Once connected, ${c.title} can search, read, and write your memory through the six \`memory__*\` tools - see the [MCP server](/docs/mcp-server) page for the full tool list and limits.`,
        },
      ],
    },
  ],
}));

/** Sidebar items for the "Connect your client" group. */
export const clientNavItems: DocNavItem[] = CLIENTS.map((c) => ({ label: c.nav, slug: c.slug }));

/** Markdown list of client links, for the MCP server hub page. */
export const clientLinksMd: string = CLIENTS.map(
  (c) => `- [${c.title}](${clientHref(c.slug)})`
).join('\n');

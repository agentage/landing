import type { DocPage } from '../types';
import { MCP_ENDPOINT_URL, MCP_AUTH_ORIGIN } from '@/lib/mcp-docs';
import { CONTACT_EMAIL, DASHBOARD_URL } from '@/lib/site';

// Symptom-first troubleshooting. Deliberately generic: clients word their errors
// differently, so this describes causes and checks, never invented messages.
export const troubleshootDoc: DocPage = {
  slug: 'troubleshoot',
  title: 'Troubleshoot',
  lede: 'What to check when a client will not connect, the tools do not show up, a sign-in keeps repeating, or a note is not where you expected it.',
  keywords: [
    'MCP troubleshooting',
    'MCP tools not showing',
    'OAuth loop MCP',
    'memory not syncing',
    'connect problems',
    'agentage support',
  ],
  sections: [
    {
      id: 'first',
      title: 'Check these first',
      blocks: [
        {
          type: 'p',
          md: `- **The endpoint** - \`${MCP_ENDPOINT_URL}\`, over Streamable HTTP. A trailing path typo is the most common cause of a client that never connects.\n- **The account** - one memory belongs to one account. Signing in with a different identity (a different email, or a social login you also have an account under) opens a different, empty memory.\n- **The client version** - remote MCP servers with OAuth are recent in most clients. If a client cannot add an HTTP server at all, update it first.`,
        },
      ],
    },
    {
      id: 'no-tools',
      title: 'The client connects but the tools are missing',
      blocks: [
        {
          type: 'p',
          md: 'A client reads its MCP configuration at startup, so a config file you just edited is usually not loaded yet.',
        },
        {
          type: 'p',
          md: [
            '- **Restart the client** after any change to its MCP config. This fixes most "the server is there but the tools are not" cases.',
            "- **Check the server is enabled** in the client's MCP server list, and that it reports a connected state rather than an error.",
            '- **Check the transport** - the server is HTTP, not a local command. A config with a `command` entry instead of a `url` will never connect.',
            '- **Agent mode** - some clients only expose tools to an agent or agent-mode chat, not to a plain chat.',
          ].join('\n'),
        },
      ],
    },
    {
      id: 'sign-in',
      title: 'The sign-in keeps repeating',
      blocks: [
        {
          type: 'p',
          md: `The sign-in runs in your browser at **${MCP_AUTH_ORIGIN}** and hands the result back to the client. A loop means one of the two halves did not complete.`,
        },
        {
          type: 'p',
          md: [
            '- **Finish the browser step** - approve the consent screen and wait for the redirect back; closing the window early leaves the client without a token.',
            '- **Let the callback through** - a blocked pop-up, a strict cookie or tracking-protection setting, or a corporate proxy can stop the redirect. Try a normal browser window rather than a private one.',
            '- **Sign in with the same identity you used before**, so you land on the same memory.',
            '- **Disconnect and reconnect** the server in the client, then sign in again. Access can expire, and a stale entry is easiest to clear by removing and re-adding the server.',
          ].join('\n'),
        },
      ],
    },
    {
      id: 'missing-notes',
      title: 'A note is missing or search finds nothing',
      blocks: [
        {
          type: 'p',
          md: [
            '- **Search is literal keyword matching**, not semantic. Search one distinctive word rather than a sentence or a paraphrase.',
            '- **Notes are addressed by path**, not by title. If you know the path, ask the agent to read it directly.',
            '- **Browse before concluding it is gone** - ask for a folder listing; a note written by another client may be in a different folder than you assume.',
            `- **Confirm the memory** - open the [dashboard](${DASHBOARD_URL}) and look at the memory itself. If the note is there but the client cannot see it, the client is signed in to a different account.`,
            '- **Deletes are recoverable** - a deleted note stays in the memory history rather than being wiped.',
          ].join('\n'),
        },
      ],
    },
    {
      id: 'sync',
      title: 'Sync conflicts and local copies',
      blocks: [
        {
          type: 'p',
          md: 'The CLI and the Obsidian plugin keep a local copy of your memory and sync it over git. When the same note changed in two places and the two versions cannot be merged automatically, the conflict is flagged rather than silently resolved.',
        },
        {
          type: 'p',
          md: [
            '- **Resolve the flagged files first**, then sync again. Nothing is dropped in the meantime.',
            '- **Sync before a long editing session** so you start from the current version.',
            '- **A local copy that has drifted badly** can be re-synced from the server side; the history is git, so the earlier versions are still there.',
          ].join('\n'),
        },
      ],
    },
    {
      id: 'still-stuck',
      title: 'Still stuck',
      blocks: [
        {
          type: 'p',
          md: `Check what the client itself reports - most clients have an MCP log or output panel that shows the connection error verbatim, which is far more useful than a generic "cannot connect". Then compare your setup against [Connect a client](/docs/connect) and the [MCP server](/docs/mcp-server) reference.`,
        },
        {
          type: 'callout',
          variant: 'info',
          md: `Still not working? Email [${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL}) with the client you are using, what you tried, and anything the client's log said.`,
        },
      ],
    },
  ],
};

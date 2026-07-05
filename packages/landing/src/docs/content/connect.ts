import type { DocPage } from '../types';
import { MCP_ENDPOINT_URL as ENDPOINT, MCP_AUTH_ORIGIN } from '@/lib/mcp-docs';
import { clientLinksMd } from './clients';

// Generic "connect any MCP client / agent" guide - vendor-neutral, for clients
// without a dedicated page. Endpoint + auth facts come from lib/mcp-docs.
export const connectDoc: DocPage = {
  slug: 'connect',
  title: 'Connect any MCP client',
  lede: 'A vendor-neutral guide to wiring any MCP-capable agent to Agentage Memory. The same endpoint and OAuth flow work everywhere - no API key.',
  keywords: [
    'connect MCP client',
    'add MCP server',
    'MCP setup',
    'OAuth MCP',
    'how to connect MCP',
    'MCP server URL',
  ],
  sections: [
    {
      id: 'basics',
      title: 'What you need',
      blocks: [
        {
          type: 'p',
          md: 'Any client that speaks the **Model Context Protocol** over **Streamable HTTP** can connect. Three facts are all it takes:',
        },
        {
          type: 'p',
          md: `- **Endpoint** - \`${ENDPOINT}\`\n- **Transport** - Streamable HTTP\n- **Auth** - OAuth 2.1 (PKCE + dynamic client registration); sign in once in the browser, no API key.`,
        },
      ],
    },
    {
      id: 'steps',
      title: 'Connect in four steps',
      blocks: [
        {
          type: 'steps',
          steps: [
            {
              title: 'Add an HTTP MCP server',
              body: 'In your client, add a new MCP server of type **http** pointing at the endpoint:',
              code: ENDPOINT,
              language: 'text',
            },
            {
              title: 'Let it register',
              body: 'On first connect the client runs **Dynamic Client Registration** automatically - nothing to pre-create or paste.',
            },
            {
              title: 'Sign in',
              body: `The client opens a browser to **${MCP_AUTH_ORIGIN}**. Approve access (magic-link, or GitHub / Google / Microsoft). No token ever touches the client config.`,
            },
            {
              title: 'Verify',
              body: 'Ask the agent to write a note and read it back (`memory__write` then `memory__read`). The same account in every client shares one memory.',
            },
          ],
        },
      ],
    },
    {
      id: 'config',
      title: 'Generic config',
      blocks: [
        {
          type: 'p',
          md: 'Most clients accept a JSON MCP config. The shape is the same everywhere - only the top-level key differs (`mcpServers` for most clients, `servers` for VS Code):',
        },
        {
          type: 'code',
          language: 'json',
          code: `{
  "mcpServers": {
    "agentage-memory": {
      "type": "http",
      "url": "${ENDPOINT}"
    }
  }
}`,
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'No API key field',
          md: 'There is no key or token to set. Auth is interactive OAuth on first use; the client obtains and stores its own short-lived token.',
        },
      ],
    },
    {
      id: 'known-clients',
      title: 'One-click for known clients',
      blocks: [
        {
          type: 'p',
          md: `Using one of these? The dedicated page has a one-click install plus the exact config:\n\n${clientLinksMd}`,
        },
      ],
    },
    {
      id: 'tools',
      title: 'Tools & limits',
      blocks: [
        {
          type: 'callout',
          variant: 'info',
          md: 'Once connected, every agent gets the same six `memory__*` tools (search / read / list / write / edit / delete). See the [MCP server](/docs/mcp-server) page for the full tool reference and limitations.',
        },
      ],
    },
  ],
};

import type { DocPage } from '../types';
import { CLI_DAEMON_BASE_URL, CLI_DAEMON_MCP_URL } from '@/lib/mcp-docs';
import { LOCAL_API_ENDPOINTS } from '@/lib/local-api-endpoints';

// The loopback HTTP API the CLI daemon serves - a JSON surface for local scripts
// and tools. Rendered as the same interactive endpoint list as the REST API page,
// from lib/local-api-endpoints.ts. The base URL comes from lib/mcp-docs.ts.
export const localApiDoc: DocPage = {
  slug: 'local-api',
  title: 'Local API',
  lede: 'A small JSON HTTP API your machine serves on the loopback interface - health, the six memory verbs, git-sync control, and a local MCP endpoint. For scripts and tools on this machine; anything remote uses the cloud MCP server instead.',
  keywords: [
    'local daemon API',
    'localhost memory API',
    '127.0.0.1:4243',
    'agentage daemon http',
    'local mcp http',
    'memory http api',
  ],
  sections: [
    {
      id: 'base-url',
      title: 'The base URL',
      blocks: [
        {
          type: 'code',
          language: 'text',
          code: CLI_DAEMON_BASE_URL,
        },
        {
          type: 'p',
          md: `The CLI's background daemon serves this API. It autostarts on the first memory verb, or start it explicitly with \`agentage daemon start\`. Every route below is plain JSON over HTTP.`,
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Loopback only, no auth',
          md: `The daemon binds to \`127.0.0.1\` and there is **no authentication** on the socket - it trusts every process on your machine and is never exposed to the network. Use it for local scripts and tools. For anything remote, use the cloud [MCP server](/docs/mcp-server) and [REST API](/docs/rest-api), which are OAuth-protected. Change the port with \`AGENTAGE_DAEMON_PORT\`.`,
        },
      ],
    },
    {
      id: 'endpoints',
      title: 'Endpoints',
      blocks: [
        {
          type: 'p',
          md: 'Every route, grouped by resource. Click a row to expand its contract - parameters, a curl example, the JSON response, response fields, and errors. The memory routes mirror the [MCP tools](/docs/mcp-tools) one-to-one; the request body carries the same parameters.',
        },
        {
          type: 'endpoints',
          groups: LOCAL_API_ENDPOINTS,
        },
      ],
    },
    {
      id: 'not',
      title: 'What this API is not',
      blocks: [
        {
          type: 'p',
          md: [
            '- Not remote - it lives on `127.0.0.1` only; never port-forward or proxy it to the internet.',
            '- Not authenticated - there are no tokens or keys; access is machine-local trust.',
            `- Not the way to connect an AI - point MCP clients at the stdio command or the local endpoint \`${CLI_DAEMON_MCP_URL}\` (see the [CLI guide](/docs/cli)). AI outside this machine uses the cloud [MCP server](/docs/mcp-server).`,
          ].join('\n'),
        },
      ],
    },
  ],
};

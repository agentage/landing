import type { DocPage } from '../types';
import { MCP_AUTH_ORIGIN, REST_RATE_LIMIT_PER_MIN, REST_VAULTS_ENDPOINT } from '@/lib/mcp-docs';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

// REST API reference. One live endpoint (GET /v1/vaults) plus the north-star
// draft contracts, rendered as an interactive list from lib/api-endpoints.ts.
// Facts (base URL, endpoint, rate limit) come from lib/mcp-docs.ts.
export const restApiDoc: DocPage = {
  slug: 'rest-api',
  title: 'REST API',
  lede: 'List your vaults over plain HTTPS - one read-only endpoint, using the same OAuth token your MCP clients already use. No SDK, no API key.',
  keywords: [
    'REST API',
    'vaults API',
    'list vaults',
    'GET /v1/vaults',
    'OAuth 2.1 bearer',
    'agentage REST API',
  ],
  sections: [
    {
      id: 'endpoint',
      title: 'The endpoint',
      blocks: [
        {
          type: 'code',
          language: 'text',
          code: `GET ${REST_VAULTS_ENDPOINT}`,
        },
        {
          type: 'p',
          md: 'One endpoint, read-only. Reading and writing notes stays on the [MCP server](/docs/mcp-server) - this API only tells you which vaults your token can see.',
        },
      ],
    },
    {
      id: 'authentication',
      title: 'Authentication',
      blocks: [
        {
          type: 'p',
          md: 'Send an OAuth 2.1 access token as a bearer header:',
        },
        {
          type: 'code',
          language: 'text',
          code: 'Authorization: Bearer <access-token>',
        },
        {
          type: 'p',
          md: `The token is the same one issued when you connect any MCP client (OAuth 2.1 with PKCE, sign-in at ${MCP_AUTH_ORIGIN}). Which vaults you see is decided by the token, not by request parameters - a token scoped to one vault lists only that vault.`,
        },
      ],
    },
    {
      id: 'endpoints',
      title: 'Endpoints',
      blocks: [
        {
          type: 'p',
          md: 'Every endpoint, grouped by resource. Click a row to expand its contract - parameters, a curl example, the 200 response, response fields, and error codes. `Live` endpoints are callable today; `Planned` rows are draft contracts from the north-star spec and are not callable yet.',
        },
        {
          type: 'endpoints',
          groups: API_ENDPOINTS,
        },
      ],
    },
    {
      id: 'limits',
      title: 'Limits and versioning',
      blocks: [
        {
          type: 'p',
          md: [
            '- Read-only: this API never modifies a vault.',
            `- Rate limited to ${REST_RATE_LIMIT_PER_MIN} requests per minute per IP.`,
            '- The `/v1` contract is frozen: fields are only ever added, never renamed or removed. Breaking changes would ship as `/v2`.',
          ].join('\n'),
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
            '- Not a way to read or write notes - use the [MCP server](/docs/mcp-server) (`memory__search/read/write/edit/list/delete`).',
            '- Not a sync channel - vault contents sync over git (Obsidian plugin, CLI).',
            '- No API keys - OAuth 2.1 bearer only.',
          ].join('\n'),
        },
      ],
    },
  ],
};

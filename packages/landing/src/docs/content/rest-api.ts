import type { DocPage } from '../types';
import {
  MCP_AUTH_ORIGIN,
  REST_API_BASE_URL,
  REST_API_VERSION,
  REST_RATE_LIMIT_PER_MIN,
} from '@/lib/mcp-docs';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

// REST API reference. Six live read-only endpoints (vault list + stats, notes
// list/read, search, export) plus the north-star draft write contracts,
// rendered as an interactive list from lib/api-endpoints.ts. Facts (base URL,
// version, rate limit) come from lib/mcp-docs.ts.
export const restApiDoc: DocPage = {
  slug: 'rest-api',
  title: 'REST API',
  lede: 'Read your vaults over plain HTTPS - six read-only endpoints, using the same OAuth token your MCP clients already use. No SDK, no API key.',
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
      id: 'base-url',
      title: 'Base URL',
      blocks: [
        {
          type: 'code',
          language: 'text',
          code: `${REST_API_BASE_URL}/${REST_API_VERSION}`,
        },
        {
          type: 'p',
          md: 'Six read-only endpoints under `/v1`: list and inspect vaults, list and read notes, search, and export. Writing notes stays on the [MCP server](/docs/mcp-server) - this API only reads.',
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
      id: 'errors',
      title: 'Errors',
      blocks: [
        {
          type: 'p',
          md: 'Every non-2xx response carries the same JSON envelope. `code` is a stable, machine-readable string you can switch on; `message` is a human-readable hint that may change.',
        },
        {
          type: 'code',
          language: 'json',
          code: '{ "error": { "code": "UNAUTHENTICATED", "message": "missing bearer token" } }',
        },
        {
          type: 'p',
          md: 'Codes: `UNAUTHENTICATED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `BAD_REQUEST` (400), `RATE_LIMITED` (429), `UPSTREAM_UNAVAILABLE` (503).',
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
            '- Rate-limit responses carry IETF draft-7 headers `ratelimit` and `ratelimit-policy` (not `X-RateLimit-*`); a 429 also sends `Retry-After`.',
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
            '- Not a way to write notes - reads are here, but writes stay on the [MCP server](/docs/mcp-server) (`memory__write/edit/delete`).',
            '- Not a sync channel - vault contents sync over git (Obsidian plugin, CLI).',
            '- No API keys - OAuth 2.1 bearer only.',
          ].join('\n'),
        },
      ],
    },
  ],
};

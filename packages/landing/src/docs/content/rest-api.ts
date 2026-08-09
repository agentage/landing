import type { DocPage } from '../types';
import {
  MCP_AUTH_ORIGIN,
  REST_API_BASE_URL,
  REST_API_VERSION,
  REST_RATE_LIMIT_PER_MIN,
  REST_VAULTS_ALIAS_NOTE,
} from '@/lib/mcp-docs';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

// REST API reference. Twelve live routes under /v1/memories (memory list/
// create/stats/delete, note list/read/write/edit/delete, search, export),
// rendered as an interactive list from lib/api-endpoints.ts. Facts (base URL,
// version, rate limit, deprecation note) come from lib/mcp-docs.ts.
export const restApiDoc: DocPage = {
  slug: 'rest-api',
  title: 'REST API',
  lede: 'Read and write your memories over plain HTTPS, using the same OAuth token your MCP clients already use. No SDK, no API key.',
  keywords: [
    'REST API',
    'memories API',
    'list memories',
    'GET /v1/memories',
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
          md: 'Twelve endpoints under `/v1`: list, create, inspect, and retire memories; list, read, write, edit, and delete notes; search; and export. Every route twins one of the six frozen `memory__*` MCP tools, so field names, defaults, and limits match the tool contract you already know.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'The vaults noun is deprecated',
          md: REST_VAULTS_ALIAS_NOTE,
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
          md: `The token is the same one issued when you connect any MCP client (OAuth 2.1 with PKCE, sign-in at ${MCP_AUTH_ORIGIN}). Which memories you see is decided by the token, not by request parameters - a token scoped to one memory lists only that memory. Reads need the \`memory:read\` scope; writes need \`memory:write\`.`,
        },
      ],
    },
    {
      id: 'endpoints',
      title: 'Endpoints',
      blocks: [
        {
          type: 'p',
          md: 'Every endpoint, grouped by resource. Click a row to expand its contract - parameters, a curl example, the 200 response, response fields, and error codes.',
        },
        {
          type: 'endpoints',
          groups: API_ENDPOINTS,
        },
      ],
    },
    {
      id: 'writes',
      title: 'Writes and concurrency',
      blocks: [
        {
          type: 'p',
          md: "Every write (`POST`/`DELETE` on memories, `PUT`/`PATCH`/`DELETE` on notes) accepts an optional `If-Match: <rev>` header for optimistic concurrency. Send the `rev` you last read; a stale value fails the write with `409 CONFLICT` instead of silently overwriting someone else's change.",
        },
        {
          type: 'p',
          md: "`rev` is the memory's HEAD sha. Read it from `GET /v1/memories/{memory}`, or from the `rev` field every write returns - chain writes without a re-fetch.",
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
          md: 'Codes: `UNAUTHENTICATED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `BAD_REQUEST` (400), `CONFLICT` (409), `RATE_LIMITED` (429), `UPSTREAM_UNAVAILABLE` (503).',
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
            '- Reads need the `memory:read` scope; writes need `memory:write`.',
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
            '- Not a sync channel - memory contents sync over git (Obsidian plugin, CLI).',
            '- No API keys - OAuth 2.1 bearer only.',
          ].join('\n'),
        },
      ],
    },
  ],
};

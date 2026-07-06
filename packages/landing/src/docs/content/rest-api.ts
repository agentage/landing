import type { DocPage } from '../types';
import { MCP_AUTH_ORIGIN, REST_RATE_LIMIT_PER_MIN, REST_VAULTS_ENDPOINT } from '@/lib/mcp-docs';

// REST API reference - one read-only endpoint that lists the vaults a token can
// see. Facts (base URL, endpoint, rate limit) come from lib/mcp-docs.ts.
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
      id: 'example',
      title: 'Example',
      blocks: [
        {
          type: 'code',
          language: 'bash',
          code: `curl -s \\
  -H "Authorization: Bearer $AGENTAGE_TOKEN" \\
  ${REST_VAULTS_ENDPOINT}`,
        },
        {
          type: 'code',
          language: 'json',
          code: `{
  "vaults": [
    {
      "name": "default",
      "files": 412,
      "folders": 37,
      "updated": "2026-07-06T07:31:02+00:00",
      "empty": false
    },
    {
      "name": "work",
      "files": 128,
      "folders": 12,
      "updated": "2026-07-05T21:47:55+00:00",
      "empty": false
    }
  ]
}`,
        },
      ],
    },
    {
      id: 'response-schema',
      title: 'Response schema',
      blocks: [
        {
          type: 'p',
          md: [
            '| Field | Type | Meaning |',
            '| --- | --- | --- |',
            '| `vaults` | array | Vaults visible to the presented token, one object per vault. |',
            '| `vaults[].name` | string | Vault slug, 1-64 chars of `a-z 0-9 _ -`. |',
            '| `vaults[].files` | integer | Number of notes currently in the vault. |',
            '| `vaults[].folders` | integer | Number of folders in the vault. |',
            '| `vaults[].updated` | string (ISO 8601) or null | Last write to the vault; `null` when the vault has no content yet. |',
            '| `vaults[].empty` | boolean | True when the vault has no notes. |',
          ].join('\n'),
        },
        {
          type: 'code',
          language: 'json',
          code: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["vaults"],
  "properties": {
    "vaults": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "files", "folders", "updated", "empty"],
        "properties": {
          "name": { "type": "string", "pattern": "^[a-z0-9_-]{1,64}$" },
          "files": { "type": "integer", "minimum": 0 },
          "folders": { "type": "integer", "minimum": 0 },
          "updated": { "type": ["string", "null"], "format": "date-time" },
          "empty": { "type": "boolean" }
        }
      }
    }
  }
}`,
        },
      ],
    },
    {
      id: 'errors',
      title: 'Errors',
      blocks: [
        {
          type: 'p',
          md: [
            '| Status | Meaning | What to do |',
            '| --- | --- | --- |',
            '| `401` | Missing, expired, or invalid token. | Re-authenticate and retry with a fresh token. |',
            '| `429` | Rate limit exceeded. | Back off and retry after the window resets. |',
            '| `503` | Auth service temporarily unavailable (never means a bad token). | Retry with backoff. |',
          ].join('\n'),
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

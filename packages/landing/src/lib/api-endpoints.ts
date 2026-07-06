// Endpoint reference for the interactive list on /docs/rest-api. Transcribed
// from the approved prototype at
// _archive/proto/api-reference-page/index.html - the six live read-only
// endpoints plus the north-star draft write contracts. Base URL from
// lib/mcp-docs.ts.

import { REST_API_BASE_URL } from './mcp-docs';
import type { EndpointArg, EndpointGroup } from '@/docs/types';

// Shared note shape, reused by the list-notes and read-note responses.
const NOTE_FIELDS: EndpointArg[] = [
  {
    name: 'path',
    type: 'string',
    description: 'POSIX .md path inside the vault, no leading slash.',
  },
  { name: 'title', type: 'string', description: 'First heading or filename.' },
  { name: 'tags', type: 'string[]', description: 'Frontmatter tags.' },
  { name: 'sizeBytes', type: 'integer', description: 'Note size.' },
  { name: 'updated', type: 'string | null', description: 'ISO 8601, last write.' },
];

export const API_ENDPOINTS: EndpointGroup[] = [
  {
    group: 'Vaults',
    items: [
      {
        method: 'GET',
        path: '/v1/vaults',
        status: 'live',
        summary: 'List the vaults your token can see',
        description:
          'Returns every vault visible to the presented token. Visibility is decided by the token (its vaults claim), never by request parameters.',
        curl: `curl -s \\
  -H "Authorization: Bearer $AGENTAGE_TOKEN" \\
  ${REST_API_BASE_URL}/v1/vaults`,
        response: `{
  "vaults": [
    { "name": "default", "files": 412, "folders": 37,
      "updated": "2026-07-06T07:31:02+00:00", "empty": false }
  ]
}`,
        fields: [
          { name: 'vaults', type: 'array', description: 'One object per visible vault.' },
          {
            name: 'vaults[].name',
            type: 'string',
            description: 'Vault slug, 1-64 chars of a-z 0-9 _ -.',
          },
          { name: 'vaults[].files', type: 'integer', description: 'Number of notes in the vault.' },
          { name: 'vaults[].folders', type: 'integer', description: 'Number of folders.' },
          {
            name: 'vaults[].updated',
            type: 'string | null',
            description: 'ISO 8601 last write; null when empty.',
          },
          {
            name: 'vaults[].empty',
            type: 'boolean',
            description: 'True when the vault has no notes.',
          },
        ],
        errors: [
          { status: '401', meaning: 'missing or invalid token' },
          { status: '429', meaning: 'rate limit exceeded' },
          { status: '503', meaning: 'auth service unavailable, retry' },
        ],
      },
      {
        method: 'POST',
        path: '/v1/vaults',
        status: 'planned',
        wave: 2,
        summary: 'Create a vault',
        description:
          'Creates a named vault. Idempotent: an existing name returns the vault instead of failing. Subject to the plan vault cap.',
        params: [
          {
            name: 'name',
            type: 'string, body',
            description: 'Vault slug, 1-64 chars of a-z 0-9 _ -. Required.',
          },
        ],
        curl: `curl -s -X POST \\
  -H "Authorization: Bearer $AGENTAGE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"work"}' \\
  ${REST_API_BASE_URL}/v1/vaults`,
        response: `{
  "vault": "work",
  "info": { "name": "work", "files": 0, "folders": 0,
            "updated": null, "empty": true }
}`,
        fields: [
          { name: 'vault', type: 'string', description: 'The created (or existing) slug.' },
          { name: 'info', type: 'object', description: 'Same shape as a vaults[] entry.' },
        ],
        errors: [
          { status: '400', meaning: 'invalid name' },
          { status: '401', meaning: 'missing or invalid token' },
          { status: '409', meaning: 'plan vault cap reached' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/vaults/{vault}',
        status: 'live',
        summary: 'Vault stats',
        description: 'Stats for one vault: counts, size and last activity.',
        params: [
          {
            name: 'vault',
            type: 'string, path',
            description: 'Vault slug. Must be granted by the token.',
          },
        ],
        curl: `curl -s -H "Authorization: Bearer $AGENTAGE_TOKEN" \\
  ${REST_API_BASE_URL}/v1/vaults/default`,
        response: `{ "name": "default", "files": 412, "folders": 37,
  "sizeBytes": 8388608, "updated": "2026-07-06T07:31:02+00:00", "empty": false }`,
        fields: [
          { name: 'sizeBytes', type: 'integer', description: 'Total vault size.' },
          { name: '...', type: '', description: 'Other fields as in vaults[].' },
        ],
        errors: [
          { status: '401', meaning: 'missing or invalid token' },
          { status: '403', meaning: 'vault not granted to this token' },
          { status: '404', meaning: 'no such vault' },
          { status: '429', meaning: 'rate limit exceeded' },
          { status: '503', meaning: 'auth service unavailable, retry' },
        ],
      },
    ],
  },
  {
    group: 'Notes',
    items: [
      {
        method: 'GET',
        path: '/v1/vaults/{vault}/notes',
        status: 'live',
        summary: 'List notes',
        description: 'Paginated listing of notes, optionally scoped to a folder.',
        params: [
          { name: 'vault', type: 'string, path', description: 'Vault slug.' },
          { name: 'folder', type: 'string, query', description: 'Folder prefix filter. Optional.' },
          { name: 'limit', type: 'integer, query', description: '1-500, default 200.' },
          { name: 'cursor', type: 'string, query', description: 'Opaque pagination cursor.' },
        ],
        curl: `curl -s -H "Authorization: Bearer $AGENTAGE_TOKEN" \\
  "${REST_API_BASE_URL}/v1/vaults/default/notes?folder=work&limit=50"`,
        response: `{
  "notes": [
    { "path": "work/plan.md", "title": "Plan", "tags": ["work"],
      "excerpt": "Q3 focus is...", "sizeBytes": 2048,
      "updated": "2026-07-05T21:47:55+00:00" }
  ],
  "nextCursor": null
}`,
        fields: [
          { name: 'notes', type: 'array', description: 'One object per note.' },
          ...NOTE_FIELDS.map((f) => ({ ...f, name: `notes[].${f.name}` })),
          {
            name: 'notes[].excerpt',
            type: 'string',
            description: 'First lines of the body, match context.',
          },
          {
            name: 'nextCursor',
            type: 'string | null',
            description: 'Pass back as cursor for the next page.',
          },
        ],
        errors: [
          { status: '401', meaning: 'missing or invalid token' },
          { status: '403', meaning: 'vault not granted' },
          { status: '404', meaning: 'no such vault' },
          { status: '429', meaning: 'rate limit exceeded' },
          { status: '503', meaning: 'auth service unavailable, retry' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/vaults/{vault}/notes/{path}',
        status: 'live',
        summary: 'Read a note',
        description: 'Full note by path: frontmatter, markdown body and metadata.',
        params: [
          { name: 'vault', type: 'string, path', description: 'Vault slug.' },
          { name: 'path', type: 'string, path', description: 'POSIX .md path, URL-encoded.' },
        ],
        curl: `curl -s -H "Authorization: Bearer $AGENTAGE_TOKEN" \\
  ${REST_API_BASE_URL}/v1/vaults/default/notes/work%2Fplan.md`,
        response: `{
  "path": "work/plan.md", "title": "Plan",
  "frontmatter": { "tags": ["work"] },
  "body": "# Plan\\n\\nQ3 focus is...",
  "tags": ["work"], "sizeBytes": 2048,
  "updated": "2026-07-05T21:47:55+00:00"
}`,
        fields: [
          ...NOTE_FIELDS,
          { name: 'frontmatter', type: 'object', description: 'Parsed YAML frontmatter.' },
          { name: 'body', type: 'string', description: 'Markdown body.' },
        ],
        errors: [
          { status: '401', meaning: 'missing or invalid token' },
          { status: '403', meaning: 'vault not granted' },
          { status: '404', meaning: 'no such note' },
          { status: '429', meaning: 'rate limit exceeded' },
          { status: '503', meaning: 'auth service unavailable, retry' },
        ],
      },
      {
        method: 'PUT',
        path: '/v1/vaults/{vault}/notes/{path}',
        status: 'planned',
        wave: 3,
        summary: 'Write a note (create or replace)',
        description:
          'Idempotent full write, mirroring the memory__write MCP tool. Wave 3: ships once edge rate limits and plan quotas are enforced.',
        params: [
          { name: 'vault', type: 'string, path', description: 'Vault slug.' },
          { name: 'path', type: 'string, path', description: 'Target .md path.' },
          { name: 'body', type: 'string, body', description: 'Markdown body. Required.' },
          { name: 'frontmatter', type: 'object, body', description: 'Optional frontmatter.' },
        ],
        curl: `curl -s -X PUT \\
  -H "Authorization: Bearer $AGENTAGE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"body":"# Plan\\n..."}' \\
  ${REST_API_BASE_URL}/v1/vaults/default/notes/work%2Fplan.md`,
        response: `{ "path": "work/plan.md", "updated": "2026-07-06T08:00:00+00:00" }`,
        fields: [
          { name: 'path', type: 'string', description: 'Written path.' },
          { name: 'updated', type: 'string', description: 'ISO 8601 commit time.' },
        ],
        errors: [
          { status: '400', meaning: 'invalid path or body' },
          { status: '401', meaning: 'missing or invalid token' },
          { status: '403', meaning: 'vault not granted' },
          { status: '429', meaning: 'rate limit exceeded' },
        ],
      },
      {
        method: 'PATCH',
        path: '/v1/vaults/{vault}/notes/{path}',
        status: 'planned',
        wave: 3,
        summary: 'Edit a note',
        description:
          'Partial update, mirroring memory__edit: replace, append, or targeted string replacement.',
        params: [
          {
            name: 'mode',
            type: 'string, body',
            description: 'replace | append | str_replace. Default replace.',
          },
          { name: 'body', type: 'string, body', description: 'New or appended content.' },
          { name: 'old_str / new_str', type: 'string, body', description: 'For str_replace mode.' },
        ],
        curl: `curl -s -X PATCH \\
  -H "Authorization: Bearer $AGENTAGE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"mode":"append","body":"\\n- new item"}' \\
  ${REST_API_BASE_URL}/v1/vaults/default/notes/work%2Fplan.md`,
        response: `{ "path": "work/plan.md", "updated": "2026-07-06T08:01:00+00:00" }`,
        fields: [
          { name: 'path', type: 'string', description: 'Edited path.' },
          { name: 'updated', type: 'string', description: 'ISO 8601 commit time.' },
        ],
        errors: [
          { status: '400', meaning: 'bad mode or no match for old_str' },
          { status: '401', meaning: 'missing or invalid token' },
          { status: '403', meaning: 'vault not granted' },
          { status: '404', meaning: 'no such note' },
        ],
      },
      {
        method: 'DELETE',
        path: '/v1/vaults/{vault}/notes/{path}',
        status: 'planned',
        wave: 3,
        summary: 'Delete a note (recoverable)',
        description:
          'Soft delete, mirroring memory__delete: the note is tombstoned in git history, not destroyed.',
        params: [
          { name: 'vault', type: 'string, path', description: 'Vault slug.' },
          { name: 'path', type: 'string, path', description: 'Note path.' },
        ],
        curl: `curl -s -X DELETE \\
  -H "Authorization: Bearer $AGENTAGE_TOKEN" \\
  ${REST_API_BASE_URL}/v1/vaults/default/notes/work%2Fold.md`,
        response: `{ "path": "work/old.md", "deleted": true }`,
        fields: [{ name: 'deleted', type: 'boolean', description: 'Always true on success.' }],
        errors: [
          { status: '401', meaning: 'missing or invalid token' },
          { status: '403', meaning: 'vault not granted' },
          { status: '404', meaning: 'no such note' },
        ],
      },
    ],
  },
  {
    group: 'Search & export',
    items: [
      {
        method: 'GET',
        path: '/v1/vaults/{vault}/search',
        status: 'live',
        summary: 'Search notes',
        description:
          'Lexical search over the vault (git-native, literal keyword matching), ranked by match count. Returns paths and snippets, never full bodies.',
        params: [
          { name: 'q', type: 'string, query', description: 'Search query. Required.' },
          { name: 'folder', type: 'string, query', description: 'Scope to a folder. Optional.' },
          { name: 'limit', type: 'integer, query', description: '1-50, default 20.' },
          { name: 'cursor', type: 'string, query', description: 'Pagination cursor.' },
        ],
        curl: `curl -s -H "Authorization: Bearer $AGENTAGE_TOKEN" \\
  "${REST_API_BASE_URL}/v1/vaults/default/search?q=roadmap"`,
        response: `{
  "results": [
    { "path": "work/plan.md", "title": "Plan",
      "snippet": "...the Q3 roadmap is...", "score": 3,
      "updated": "2026-07-05T21:47:55+00:00" }
  ],
  "nextCursor": null
}`,
        fields: [
          { name: 'results', type: 'array', description: 'Ranked matches.' },
          { name: 'results[].snippet', type: 'string', description: 'Match context.' },
          {
            name: 'results[].score',
            type: 'integer',
            description: 'Match count - how many times the query hits the note.',
          },
          { name: 'nextCursor', type: 'string | null', description: 'Next page cursor.' },
        ],
        errors: [
          { status: '400', meaning: 'missing q' },
          { status: '401', meaning: 'missing or invalid token' },
          { status: '403', meaning: 'vault not granted' },
          { status: '429', meaning: 'rate limit exceeded' },
          { status: '503', meaning: 'auth service unavailable, retry' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/vaults/{vault}/export',
        status: 'live',
        summary: 'Export the vault as a git bundle',
        description:
          'Streams a cloneable git bundle of the whole vault: full history, plain markdown, yours. Content-Type application/x-git-bundle.',
        params: [{ name: 'vault', type: 'string, path', description: 'Vault slug.' }],
        curl: `curl -s -H "Authorization: Bearer $AGENTAGE_TOKEN" \\
  -o memory.bundle \\
  ${REST_API_BASE_URL}/v1/vaults/default/export
git clone memory.bundle my-memory`,
        response: `(binary git bundle stream)`,
        fields: [
          {
            name: '-',
            type: 'application/x-git-bundle',
            description: 'Attachment; clone it with plain git.',
          },
        ],
        errors: [
          { status: '401', meaning: 'missing or invalid token' },
          { status: '403', meaning: 'vault not granted' },
          { status: '404', meaning: 'no such vault' },
          { status: '429', meaning: 'rate limit exceeded' },
          { status: '503', meaning: 'auth service unavailable, retry' },
        ],
      },
    ],
  },
];

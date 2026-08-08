// Endpoint reference for the interactive list on /docs/rest-api. Twin of the
// v1 OpenAPI snapshot (agentage/web packages/memory-mcp/.v1-openapi.json) -
// every route, param, and response field here must match that snapshot.
// Base URL from lib/mcp-docs.ts.

import { REST_API_BASE_URL } from './mcp-docs';
import type { EndpointArg, EndpointGroup } from '@/docs/types';

// The If-Match header, reused by every write - optional optimistic concurrency.
const IF_MATCH_PARAM: EndpointArg = {
  name: 'If-Match',
  type: 'string, header',
  description: "Optional. The memory's rev; a stale value fails the write with 409.",
};

export const API_ENDPOINTS: EndpointGroup[] = [
  {
    group: 'Memories',
    items: [
      {
        method: 'GET',
        path: '/v1/memories',
        status: 'live',
        summary: 'List the memories your token can see',
        description:
          'Returns every memory visible to the presented token. Visibility is decided by the token (its memories claim), never by request parameters. Requires memory:read.',
        curl: `curl -s \\
  -H "Authorization: Bearer $AGENTAGE_TOKEN" \\
  ${REST_API_BASE_URL}/v1/memories`,
        response: `{
  "memories": [
    { "name": "default", "files": 412, "folders": 37, "sizeBytes": 8388608,
      "updated": "2026-07-06T07:31:02+00:00", "empty": false,
      "rev": "3f1c9a0e8b2d4c5e6f708192a3b4c5d6e7f80912" }
  ]
}`,
        fields: [
          { name: 'memories', type: 'array', description: 'One object per visible memory.' },
          {
            name: 'memories[].name',
            type: 'string',
            description: 'Memory slug, 1-64 chars of a-z 0-9 _ -.',
          },
          {
            name: 'memories[].files',
            type: 'integer',
            description: 'Number of notes in the memory.',
          },
          { name: 'memories[].folders', type: 'integer', description: 'Number of folders.' },
          { name: 'memories[].sizeBytes', type: 'integer', description: 'Total memory size.' },
          {
            name: 'memories[].updated',
            type: 'string | null',
            description: 'ISO 8601 last write; null when empty.',
          },
          {
            name: 'memories[].empty',
            type: 'boolean',
            description: 'True when the memory has no notes.',
          },
          {
            name: 'memories[].rev',
            type: 'string | null',
            description: 'HEAD sha. Changes only on write; use as a poll token and If-Match value.',
          },
        ],
        errors: [
          { status: '401', meaning: 'missing, invalid, or expired token' },
          { status: '403', meaning: 'missing required scope' },
          { status: '429', meaning: 'rate limit exceeded' },
          { status: '503', meaning: 'auth service unavailable, retry' },
        ],
      },
      {
        method: 'POST',
        path: '/v1/memories',
        status: 'live',
        summary: 'Create a memory',
        description:
          'Creates a named memory. Idempotent: an existing name returns 200 with the memory; a new name returns 201. `export` is reserved - it addresses the collection-export route, not a memory. Requires memory:write.',
        params: [
          {
            name: 'name',
            type: 'string, body',
            description: 'Memory slug, 1-64 chars of a-z 0-9 _ -. Required.',
          },
        ],
        curl: `curl -s -X POST \\
  -H "Authorization: Bearer $AGENTAGE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"work"}' \\
  ${REST_API_BASE_URL}/v1/memories`,
        response: `{ "name": "work", "files": 0, "folders": 0, "sizeBytes": 0,
  "updated": null, "empty": true, "rev": null }`,
        fields: [
          { name: 'name', type: 'string', description: 'The created (or existing) slug.' },
          { name: '...', type: '', description: 'Other fields as in memories[] above.' },
        ],
        errors: [
          { status: '400', meaning: 'invalid or reserved name' },
          { status: '401', meaning: 'missing, invalid, or expired token' },
          { status: '403', meaning: 'missing required scope' },
          { status: '409', meaning: 'at the per-account memory ceiling' },
          { status: '429', meaning: 'rate limit exceeded' },
          { status: '503', meaning: 'auth service unavailable, retry' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/memories/{memory}',
        status: 'live',
        summary: 'Memory stats',
        description: 'Stats for one memory: counts, size, last activity, and its current rev.',
        params: [
          {
            name: 'memory',
            type: 'string, path',
            description: 'Memory slug. Must be granted by the token.',
          },
        ],
        curl: `curl -s -H "Authorization: Bearer $AGENTAGE_TOKEN" \\
  ${REST_API_BASE_URL}/v1/memories/default`,
        response: `{ "name": "default", "files": 412, "folders": 37, "sizeBytes": 8388608,
  "updated": "2026-07-06T07:31:02+00:00", "empty": false,
  "rev": "3f1c9a0e8b2d4c5e6f708192a3b4c5d6e7f80912" }`,
        fields: [
          {
            name: 'rev',
            type: 'string | null',
            description: 'HEAD sha - poll it, or send it back as If-Match on a write.',
          },
          { name: '...', type: '', description: 'Other fields as in memories[] above.' },
        ],
        errors: [
          { status: '401', meaning: 'missing, invalid, or expired token' },
          { status: '403', meaning: 'memory not granted to this token' },
          { status: '404', meaning: 'no such memory' },
          { status: '429', meaning: 'rate limit exceeded' },
          { status: '503', meaning: 'auth service unavailable, retry' },
        ],
      },
      {
        method: 'DELETE',
        path: '/v1/memories/{memory}',
        status: 'live',
        summary: 'Retire a memory',
        description:
          'Deletes a memory. Recoverable: the store tombstones it rather than destroying it. Requires memory:write.',
        params: [
          { name: 'memory', type: 'string, path', description: 'Memory slug.' },
          IF_MATCH_PARAM,
        ],
        curl: `curl -s -X DELETE \\
  -H "Authorization: Bearer $AGENTAGE_TOKEN" \\
  -H "If-Match: 3f1c9a0e8b2d4c5e6f708192a3b4c5d6e7f80912" \\
  ${REST_API_BASE_URL}/v1/memories/work`,
        response: `{ "name": "work", "deleted": true }`,
        fields: [
          { name: 'name', type: 'string', description: 'The retired slug.' },
          { name: 'deleted', type: 'boolean', description: 'Always true on success.' },
        ],
        errors: [
          { status: '401', meaning: 'missing, invalid, or expired token' },
          { status: '403', meaning: 'memory not granted to this token' },
          { status: '404', meaning: 'no such memory' },
          { status: '409', meaning: 'If-Match did not match the current rev' },
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
        path: '/v1/memories/{memory}/notes',
        status: 'live',
        summary: 'List notes and folders',
        description:
          'Paginated listing of one folder level, twin of memory__list. Mixes file and folder entries; use `type` to filter to one kind.',
        params: [
          { name: 'memory', type: 'string, path', description: 'Memory slug.' },
          {
            name: 'folder',
            type: 'string, query',
            description: 'Folder to browse. Optional, default root.',
          },
          {
            name: 'depth',
            type: 'integer | "all", query',
            description: 'Levels below the browsed folder, minimum 1. Default 2.',
          },
          { name: 'type', type: 'string, query', description: 'all | file | folder. Default all.' },
          {
            name: 'fields',
            type: 'string, query',
            description: "'path' trims file entries to type + path only. Default full.",
          },
          {
            name: 'tags',
            type: 'string[], query',
            description: 'AND-matched. Repeat the param or comma-separate.',
          },
          { name: 'sort', type: 'string, query', description: 'name | updated. Default name.' },
          { name: 'limit', type: 'integer, query', description: '1-500, default 200.' },
          { name: 'cursor', type: 'string, query', description: 'Opaque pagination cursor.' },
        ],
        curl: `curl -s -H "Authorization: Bearer $AGENTAGE_TOKEN" \\
  "${REST_API_BASE_URL}/v1/memories/default/notes?folder=work&limit=50"`,
        response: `{
  "folder": "work",
  "entries": [
    { "type": "file", "path": "work/plan.md", "title": "Plan", "tags": ["work"],
      "excerpt": "Q3 focus is...", "sizeBytes": 2048,
      "updated": "2026-07-05T21:47:55+00:00" },
    { "type": "folder", "path": "work/archive", "files": 6 }
  ],
  "files": 7,
  "truncated": false
}`,
        fields: [
          { name: 'folder', type: 'string', description: 'The browsed folder, echoed back.' },
          {
            name: 'entries',
            type: 'array',
            description: 'One entry per file or subfolder; shape depends on type.',
          },
          { name: 'entries[].type', type: 'string', description: '"file" or "folder".' },
          { name: 'entries[].path', type: 'string', description: 'POSIX path inside the memory.' },
          {
            name: 'entries[].title',
            type: 'string',
            description: 'First heading or filename. File entries only.',
          },
          {
            name: 'entries[].tags',
            type: 'string[]',
            description: 'Frontmatter tags. File entries only.',
          },
          {
            name: 'entries[].excerpt',
            type: 'string',
            description: 'Unconditional preview, not query-anchored. File entries only.',
          },
          {
            name: 'entries[].sizeBytes',
            type: 'integer',
            description: 'Note size. File entries only.',
          },
          {
            name: 'entries[].updated',
            type: 'string | null',
            description: 'ISO 8601, last write. File entries only.',
          },
          {
            name: 'entries[].files',
            type: 'integer',
            description: 'Recursive file count. Folder entries only.',
          },
          { name: 'files', type: 'integer', description: 'File count for this listing.' },
          {
            name: 'truncated',
            type: 'boolean',
            description: 'True when more entries exist beyond limit.',
          },
          {
            name: 'nextCursor',
            type: 'string',
            description:
              'Pass back as cursor for the next page. Omitted when the listing is exhausted.',
          },
        ],
        errors: [
          { status: '400', meaning: 'invalid cursor or query value' },
          { status: '401', meaning: 'missing, invalid, or expired token' },
          { status: '403', meaning: 'memory not granted' },
          { status: '404', meaning: 'no such memory' },
          { status: '429', meaning: 'rate limit exceeded' },
          { status: '503', meaning: 'auth service unavailable, retry' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/memories/{memory}/notes/{path}',
        status: 'live',
        summary: 'Read a note',
        description:
          'Full note by path: frontmatter, markdown body, and metadata, twin of memory__read. Send `Accept: text/markdown` to get the file exactly as stored instead of the JSON envelope.',
        params: [
          { name: 'memory', type: 'string, path', description: 'Memory slug.' },
          { name: 'path', type: 'string, path', description: 'POSIX .md path, URL-encoded.' },
          {
            name: 'Accept',
            type: 'string, header',
            description: 'text/markdown returns the raw file. Optional, default application/json.',
          },
        ],
        curl: `curl -s -H "Authorization: Bearer $AGENTAGE_TOKEN" \\
  ${REST_API_BASE_URL}/v1/memories/default/notes/work%2Fplan.md`,
        response: `{
  "path": "work/plan.md", "title": "Plan",
  "frontmatter": { "tags": ["work"] },
  "body": "# Plan\\n\\nQ3 focus is...",
  "tags": ["work"], "sizeBytes": 2048,
  "updated": "2026-07-05T21:47:55+00:00"
}`,
        fields: [
          { name: 'path', type: 'string', description: 'POSIX .md path inside the memory.' },
          { name: 'title', type: 'string', description: 'First heading or filename.' },
          { name: 'frontmatter', type: 'object', description: 'Parsed YAML frontmatter.' },
          { name: 'body', type: 'string', description: 'Markdown body.' },
          { name: 'tags', type: 'string[]', description: 'Frontmatter tags.' },
          { name: 'sizeBytes', type: 'integer', description: 'Note size.' },
          { name: 'updated', type: 'string', description: 'ISO 8601, last write.' },
        ],
        errors: [
          { status: '401', meaning: 'missing, invalid, or expired token' },
          { status: '403', meaning: 'memory not granted' },
          { status: '404', meaning: 'no such note' },
          { status: '429', meaning: 'rate limit exceeded' },
          { status: '503', meaning: 'auth service unavailable, retry' },
        ],
      },
      {
        method: 'PUT',
        path: '/v1/memories/{memory}/notes/{path}',
        status: 'live',
        summary: 'Write a note (create or replace)',
        description:
          'Full write, twin of memory__write. Send JSON with a `body` field, or post raw markdown with `Content-Type: text/markdown`. Requires memory:write.',
        params: [
          { name: 'memory', type: 'string, path', description: 'Memory slug.' },
          { name: 'path', type: 'string, path', description: 'Target .md path, URL-encoded.' },
          IF_MATCH_PARAM,
          {
            name: 'body',
            type: 'string, body',
            description: 'Markdown body. Required in the JSON form.',
          },
          { name: 'frontmatter', type: 'object, body', description: 'Optional frontmatter.' },
        ],
        curl: `curl -s -X PUT \\
  -H "Authorization: Bearer $AGENTAGE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -H "If-Match: 3f1c9a0e8b2d4c5e6f708192a3b4c5d6e7f80912" \\
  -d '{"body":"# Plan\\n..."}' \\
  ${REST_API_BASE_URL}/v1/memories/default/notes/work%2Fplan.md`,
        response: `{ "path": "work/plan.md", "rev": "9a0e8b2d4c5e6f708192a3b4c5d6e7f80912ab3f",
  "updated": "2026-07-06T08:00:00+00:00" }`,
        fields: [
          { name: 'path', type: 'string', description: 'Written path.' },
          {
            name: 'rev',
            type: 'string',
            description: "The memory's new HEAD sha - use it as the next If-Match.",
          },
          { name: 'updated', type: 'string', description: 'ISO 8601 commit time.' },
        ],
        errors: [
          { status: '400', meaning: 'missing body, or content refused as a credential' },
          { status: '401', meaning: 'missing, invalid, or expired token' },
          { status: '403', meaning: 'memory not granted' },
          { status: '404', meaning: 'no such memory' },
          { status: '409', meaning: 'If-Match did not match the current rev' },
          { status: '429', meaning: 'rate limit exceeded' },
          { status: '503', meaning: 'auth service unavailable, retry' },
        ],
      },
      {
        method: 'PATCH',
        path: '/v1/memories/{memory}/notes/{path}',
        status: 'live',
        summary: 'Edit a note',
        description:
          'Partial update, twin of memory__edit: replace, append, or a targeted string replacement. Requires memory:write.',
        params: [
          { name: 'memory', type: 'string, path', description: 'Memory slug.' },
          { name: 'path', type: 'string, path', description: 'Note path.' },
          IF_MATCH_PARAM,
          {
            name: 'mode',
            type: 'string, body',
            description: 'replace | append | str_replace. Default replace.',
          },
          { name: 'body', type: 'string, body', description: 'New or appended content.' },
          {
            name: 'frontmatter',
            type: 'object, body',
            description: 'Shallow-merged; cannot remove a key.',
          },
          {
            name: 'old_str',
            type: 'string, body',
            description: 'Required for str_replace; must match exactly one place.',
          },
          { name: 'new_str', type: 'string, body', description: 'Omit to delete old_str.' },
        ],
        curl: `curl -s -X PATCH \\
  -H "Authorization: Bearer $AGENTAGE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"mode":"append","body":"\\n- new item"}' \\
  ${REST_API_BASE_URL}/v1/memories/default/notes/work%2Fplan.md`,
        response: `{ "path": "work/plan.md", "rev": "0e8b2d4c5e6f708192a3b4c5d6e7f80912ab3f9a",
  "updated": "2026-07-06T08:01:00+00:00" }`,
        fields: [
          { name: 'path', type: 'string', description: 'Edited path.' },
          {
            name: 'rev',
            type: 'string',
            description: "The memory's new HEAD sha - use it as the next If-Match.",
          },
          { name: 'updated', type: 'string', description: 'ISO 8601 commit time.' },
        ],
        errors: [
          {
            status: '400',
            meaning: 'invalid mode/arguments, no unique str_replace match, or refused content',
          },
          { status: '401', meaning: 'missing, invalid, or expired token' },
          { status: '403', meaning: 'memory not granted' },
          { status: '404', meaning: 'no such note' },
          { status: '409', meaning: 'If-Match did not match the current rev' },
          { status: '429', meaning: 'rate limit exceeded' },
          { status: '503', meaning: 'auth service unavailable, retry' },
        ],
      },
      {
        method: 'DELETE',
        path: '/v1/memories/{memory}/notes/{path}',
        status: 'live',
        summary: 'Delete a note (recoverable)',
        description:
          'Soft delete, twin of memory__delete: the note is tombstoned in git history, not destroyed. Requires memory:write.',
        params: [
          { name: 'memory', type: 'string, path', description: 'Memory slug.' },
          { name: 'path', type: 'string, path', description: 'Note path.' },
          IF_MATCH_PARAM,
        ],
        curl: `curl -s -X DELETE \\
  -H "Authorization: Bearer $AGENTAGE_TOKEN" \\
  ${REST_API_BASE_URL}/v1/memories/default/notes/work%2Fold.md`,
        response: `{ "path": "work/old.md", "deleted": true }`,
        fields: [{ name: 'deleted', type: 'boolean', description: 'Always true on success.' }],
        errors: [
          { status: '401', meaning: 'missing, invalid, or expired token' },
          { status: '403', meaning: 'memory not granted' },
          { status: '404', meaning: 'no such note' },
          { status: '409', meaning: 'If-Match did not match the current rev' },
          { status: '429', meaning: 'rate limit exceeded' },
          { status: '503', meaning: 'auth service unavailable, retry' },
        ],
      },
    ],
  },
  {
    group: 'Search & export',
    items: [
      {
        method: 'GET',
        path: '/v1/memories/{memory}/search',
        status: 'live',
        summary: 'Search notes',
        description:
          'Lexical search over the memory (git-native, literal keyword matching), ranked by match count, twin of memory__search. Returns paths and snippets, never full bodies.',
        params: [
          { name: 'memory', type: 'string, path', description: 'Memory slug.' },
          { name: 'q', type: 'string, query', description: 'Search query. Required.' },
          { name: 'folder', type: 'string, query', description: 'Scope to a folder. Optional.' },
          { name: 'tags', type: 'string[], query', description: 'Scope to notes with these tags.' },
          { name: 'limit', type: 'integer, query', description: '1-50, default 20.' },
          { name: 'cursor', type: 'string, query', description: 'Pagination cursor.' },
        ],
        curl: `curl -s -H "Authorization: Bearer $AGENTAGE_TOKEN" \\
  "${REST_API_BASE_URL}/v1/memories/default/search?q=roadmap"`,
        response: `{
  "results": [
    { "path": "work/plan.md", "title": "Plan",
      "snippet": "...the Q3 roadmap is...", "score": 3,
      "updated": "2026-07-05T21:47:55+00:00" }
  ]
}`,
        fields: [
          { name: 'results', type: 'array', description: 'Ranked matches.' },
          {
            name: 'results[].snippet',
            type: 'string',
            description: 'Window around the first match.',
          },
          {
            name: 'results[].score',
            type: 'integer',
            description: 'Match count, not a relevance percentage.',
          },
          {
            name: 'nextCursor',
            type: 'string',
            description: 'Next page cursor. Omitted when exhausted.',
          },
        ],
        errors: [
          { status: '400', meaning: 'missing q' },
          { status: '401', meaning: 'missing, invalid, or expired token' },
          { status: '403', meaning: 'memory not granted' },
          { status: '404', meaning: 'no such memory' },
          { status: '429', meaning: 'rate limit exceeded' },
          { status: '503', meaning: 'auth service unavailable, retry' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/memories/{memory}/export',
        status: 'live',
        summary: 'Export one memory as a git bundle',
        description:
          'Streams a cloneable git bundle of one memory: full history, plain markdown, yours. Content-Type application/x-git-bundle.',
        params: [{ name: 'memory', type: 'string, path', description: 'Memory slug.' }],
        curl: `curl -s -H "Authorization: Bearer $AGENTAGE_TOKEN" \\
  -o memory.bundle \\
  ${REST_API_BASE_URL}/v1/memories/default/export
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
          { status: '401', meaning: 'missing, invalid, or expired token' },
          { status: '403', meaning: 'memory not granted' },
          { status: '404', meaning: 'no such memory, or it has no history' },
          { status: '429', meaning: 'rate limit exceeded' },
          { status: '503', meaning: 'auth service unavailable, retry' },
        ],
      },
      {
        method: 'GET',
        path: '/v1/memories/export',
        status: 'live',
        summary: 'Export every visible memory as one zip',
        description:
          'Streams a zip of every memory the token can see, one `<memory>/<path>` markdown file per note, frontmatter included. `export` is reserved as a memory name so this route never collides with a real memory.',
        curl: `curl -s -H "Authorization: Bearer $AGENTAGE_TOKEN" \\
  -o memories.zip \\
  ${REST_API_BASE_URL}/v1/memories/export`,
        response: `(binary zip stream)`,
        fields: [
          {
            name: '-',
            type: 'application/zip',
            description: '<memory>/<path> markdown files, frontmatter included.',
          },
        ],
        errors: [
          { status: '401', meaning: 'missing, invalid, or expired token' },
          { status: '403', meaning: 'missing required scope' },
          { status: '429', meaning: 'rate limit exceeded' },
          { status: '503', meaning: 'auth service unavailable, retry' },
        ],
      },
    ],
  },
];

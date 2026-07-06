// Endpoint reference for the interactive list on /docs/local-api. These are the
// loopback-only routes the background daemon serves (127.0.0.1, no auth). Every
// shape here was captured from a running daemon; the base URL comes from
// lib/mcp-docs.ts so it never drifts from the CLI page.

import { CLI_DAEMON_BASE_URL as BASE } from './mcp-docs';
import type { EndpointGroup } from '@/docs/types';

// The memory verbs all POST to /api/memory/<verb> with a JSON body that mirrors
// the tool params. Shared response fields for the write-family verbs.
const WRITE_RESULT_FIELDS = [
  { name: 'path', type: 'string', description: 'The document path that was written.' },
  { name: 'rev', type: 'string', description: 'Git commit hash of this write.' },
  { name: 'updated', type: 'string', description: 'ISO 8601 commit time.' },
];

export const LOCAL_API_ENDPOINTS: EndpointGroup[] = [
  {
    group: 'Health',
    items: [
      {
        method: 'GET',
        path: '/api/health',
        status: 'live',
        summary: 'Liveness, version and uptime',
        description:
          'Cheap liveness probe. Returns the running CLI version, the daemon pid, its uptime and how many memory requests it has served. Use it to check whether the daemon is up before scripting against it.',
        curl: `curl -s ${BASE}/api/health`,
        response: `{
  "ok": true,
  "version": "0.1.0",
  "pid": 51234,
  "uptime": 42,
  "served": 7
}`,
        fields: [
          { name: 'ok', type: 'boolean', description: 'Always true when the daemon answers.' },
          { name: 'version', type: 'string', description: 'Running CLI version.' },
          { name: 'pid', type: 'integer', description: 'Daemon process id.' },
          { name: 'uptime', type: 'integer', description: 'Seconds since the daemon started.' },
          { name: 'served', type: 'integer', description: 'Memory requests served so far.' },
        ],
        errors: [
          {
            status: 'ECONNREFUSED',
            meaning: 'the daemon is not running - start it with `agentage daemon start`',
          },
        ],
      },
    ],
  },
  {
    group: 'Memory',
    items: [
      {
        method: 'POST',
        path: '/api/memory/search',
        status: 'live',
        summary: 'Search a vault (git grep)',
        description:
          'Literal substring search over a vault, ranked by match count. Returns paths and snippets, never full bodies. Mirrors the memory__search tool.',
        params: [
          { name: 'query', type: 'string, body', description: 'Search text. Required.' },
          { name: 'opts.vault', type: 'string, body', description: 'Target vault. Optional.' },
          {
            name: 'opts.folder',
            type: 'string, body',
            description: 'Scope to a folder. Optional.',
          },
          { name: 'opts.limit', type: 'integer, body', description: 'Max hits, default 20.' },
        ],
        curl: `curl -s -X POST ${BASE}/api/memory/search \\
  -H "Content-Type: application/json" \\
  -d '{"query":"postgres","opts":{"vault":"notes","limit":5}}'`,
        response: `{
  "results": [
    { "path": "@notes/welcome.md", "title": "welcome",
      "snippet": "# Welcome We use Postgres for full-text search.",
      "score": 1, "updated": "2026-07-06T14:11:31+00:00" }
  ]
}`,
        fields: [
          { name: 'results', type: 'array', description: 'Ranked matches.' },
          {
            name: 'results[].path',
            type: 'string',
            description: 'Document path; @<vault>/ prefixed when scoped to a vault.',
          },
          { name: 'results[].snippet', type: 'string', description: 'Match context.' },
          {
            name: 'results[].score',
            type: 'integer',
            description: 'Match count - how many times the query hits the note.',
          },
          {
            name: 'nextCursor',
            type: 'string | null',
            description: 'Pass back as opts.cursor for the next page.',
          },
        ],
        errors: [
          { status: '400', meaning: 'invalid JSON body' },
          { status: '404', meaning: 'unknown verb' },
        ],
      },
      {
        method: 'POST',
        path: '/api/memory/read',
        status: 'live',
        summary: 'Read a document',
        description:
          'Full document by path: frontmatter, markdown body and metadata. Bodies over 64 KB are clamped. Mirrors memory__read.',
        params: [
          {
            name: 'ref',
            type: 'string, body',
            description: '@<vault>/<path>, or <path> with opts.vault. Required.',
          },
          { name: 'opts.vault', type: 'string, body', description: 'Target vault. Optional.' },
        ],
        curl: `curl -s -X POST ${BASE}/api/memory/read \\
  -H "Content-Type: application/json" \\
  -d '{"ref":"@notes/welcome.md"}'`,
        response: `{
  "path": "welcome.md",
  "title": "welcome",
  "frontmatter": {},
  "body": "# Welcome\\nWe use Postgres for full-text search.\\n",
  "tags": [],
  "updated": "2026-07-06T14:11:31+00:00",
  "deleted": false
}`,
        fields: [
          { name: 'path', type: 'string', description: 'Resolved document path.' },
          { name: 'title', type: 'string', description: 'First heading or filename.' },
          { name: 'frontmatter', type: 'object', description: 'Parsed YAML frontmatter.' },
          { name: 'body', type: 'string', description: 'Markdown body.' },
          { name: 'tags', type: 'string[]', description: 'Frontmatter tags.' },
          { name: 'updated', type: 'string', description: 'ISO 8601 last write.' },
          { name: 'deleted', type: 'boolean', description: 'True for a tombstoned document.' },
        ],
        errors: [{ status: '400', meaning: 'not found, or invalid body' }],
      },
      {
        method: 'POST',
        path: '/api/memory/write',
        status: 'live',
        summary: 'Create or overwrite a document',
        description:
          'Idempotent full write - creates or replaces the document and commits. The engine refuses to store obvious secrets. Mirrors memory__write.',
        params: [
          { name: 'ref', type: 'string, body', description: 'Target document. Required.' },
          { name: 'body', type: 'string, body', description: 'Markdown body. Required.' },
          { name: 'opts.vault', type: 'string, body', description: 'Target vault. Optional.' },
          {
            name: 'opts.frontmatter',
            type: 'object, body',
            description: 'YAML frontmatter to set. Optional.',
          },
        ],
        curl: `curl -s -X POST ${BASE}/api/memory/write \\
  -H "Content-Type: application/json" \\
  -d '{"ref":"work/plan.md","body":"Q3 focus is search.","opts":{"vault":"notes","frontmatter":{"tags":["work"]}}}'`,
        response: `{
  "path": "work/plan.md",
  "rev": "0a5c9aff51705440acff72b7563b259111b08c4e",
  "updated": "2026-07-06T14:11:54.663Z"
}`,
        fields: WRITE_RESULT_FIELDS,
        errors: [{ status: '400', meaning: 'invalid body, or a refused secret' }],
      },
      {
        method: 'POST',
        path: '/api/memory/edit',
        status: 'live',
        summary: 'Edit a document',
        description:
          'Targeted edit: str_replace (op.old_str / op.new_str), or replace/append the body (op.mode + op.body). Mirrors memory__edit.',
        params: [
          { name: 'ref', type: 'string, body', description: 'Target document. Required.' },
          {
            name: 'op.mode',
            type: 'string, body',
            description: 'replace | append | str_replace.',
          },
          { name: 'op.body', type: 'string, body', description: 'New or appended content.' },
          {
            name: 'op.old_str / op.new_str',
            type: 'string, body',
            description: 'Exact, unique substring to replace, and its replacement.',
          },
        ],
        curl: `curl -s -X POST ${BASE}/api/memory/edit \\
  -H "Content-Type: application/json" \\
  -d '{"ref":"@notes/welcome.md","op":{"mode":"str_replace","old_str":"Postgres","new_str":"SQLite"}}'`,
        response: `{
  "path": "@notes/welcome.md",
  "rev": "2abbd3203f725b8373e56194df938fdc6b887bab",
  "updated": "2026-07-06T14:12:22.931Z"
}`,
        fields: WRITE_RESULT_FIELDS,
        errors: [{ status: '400', meaning: 'no match for old_str, or not found' }],
      },
      {
        method: 'POST',
        path: '/api/memory/list',
        status: 'live',
        summary: 'List the folder tree',
        description:
          'Browse a vault as a folder tree (two levels deep). Paths are @<vault>/ prefixed when scoped to a vault. Mirrors memory__list.',
        params: [
          { name: 'folder', type: 'string, body', description: 'Folder prefix. Optional.' },
          { name: 'opts.vault', type: 'string, body', description: 'Target vault. Optional.' },
        ],
        curl: `curl -s -X POST ${BASE}/api/memory/list \\
  -H "Content-Type: application/json" \\
  -d '{"opts":{"vault":"notes"}}'`,
        response: `{
  "folder": "@notes",
  "entries": [
    { "type": "folder", "path": "@notes/work", "files": 1 },
    { "type": "file", "path": "@notes/welcome.md",
      "title": "welcome", "updated": "2026-07-06T14:11:31+00:00" }
  ],
  "truncated": false,
  "files": 2
}`,
        fields: [
          { name: 'folder', type: 'string', description: 'The listed folder.' },
          { name: 'entries', type: 'array', description: 'File and folder nodes, tree order.' },
          {
            name: 'entries[].type',
            type: 'string',
            description: '"file" or "folder".',
          },
          { name: 'entries[].path', type: 'string', description: 'Node path.' },
          { name: 'files', type: 'integer', description: 'Total files under the folder.' },
        ],
        errors: [{ status: '400', meaning: 'invalid body' }],
      },
      {
        method: 'POST',
        path: '/api/memory/delete',
        status: 'live',
        summary: 'Delete a document (recoverable)',
        description:
          'Removes the document and commits the deletion, so it stays recoverable from git history. Mirrors memory__delete.',
        params: [
          { name: 'ref', type: 'string, body', description: 'Target document. Required.' },
          { name: 'opts.vault', type: 'string, body', description: 'Target vault. Optional.' },
        ],
        curl: `curl -s -X POST ${BASE}/api/memory/delete \\
  -H "Content-Type: application/json" \\
  -d '{"ref":"@notes/old.md"}'`,
        response: `{ "path": "@notes/old.md", "deleted": true }`,
        fields: [
          { name: 'path', type: 'string', description: 'The deleted document path.' },
          {
            name: 'deleted',
            type: 'boolean',
            description: 'Always true on success (recoverable from git history).',
          },
        ],
        errors: [{ status: '400', meaning: 'not found' }],
      },
    ],
  },
  {
    group: 'Sync',
    items: [
      {
        method: 'GET',
        path: '/api/sync/status',
        status: 'live',
        summary: 'Per-vault git-sync state',
        description:
          'The current state of every git-backed vault: its remote, interval, whether a cycle is running, and the last run and result. Empty when no vault has a git remote.',
        curl: `curl -s ${BASE}/api/sync/status`,
        response: `{
  "vaults": [
    { "vault": "work",
      "remote": "git@github.com:you/memory.git",
      "intervalSeconds": 300,
      "running": false }
  ]
}`,
        fields: [
          { name: 'vaults', type: 'array', description: 'One entry per git-backed vault.' },
          { name: 'vaults[].vault', type: 'string', description: 'Vault name.' },
          { name: 'vaults[].remote', type: 'string', description: 'Git remote URL.' },
          {
            name: 'vaults[].intervalSeconds',
            type: 'integer',
            description: 'Auto-sync interval; 0 = manual only.',
          },
          {
            name: 'vaults[].running',
            type: 'boolean',
            description: 'True while a cycle is in flight.',
          },
          {
            name: 'vaults[].lastRun',
            type: 'string',
            description: 'ISO 8601 of the last cycle. Optional.',
          },
          {
            name: 'vaults[].lastResult',
            type: 'object',
            description: 'Summary of the last cycle (ok, pushed, committed, conflicts). Optional.',
          },
        ],
        errors: [],
      },
      {
        method: 'POST',
        path: '/api/sync/run',
        status: 'live',
        summary: 'Sync one vault now',
        description:
          'Forces a commit + push + pull-rebase for a single vault, regardless of its interval. Conflicts keep both sides: the remote copy is written as <file>.conflict.md.',
        params: [{ name: 'vault', type: 'string, body', description: 'Vault to sync. Required.' }],
        curl: `curl -s -X POST ${BASE}/api/sync/run \\
  -H "Content-Type: application/json" \\
  -d '{"vault":"work"}'`,
        response: `{
  "vault": "work",
  "remote": "git@github.com:you/memory.git",
  "ok": true,
  "committed": true,
  "pushed": true,
  "conflicts": []
}`,
        fields: [
          { name: 'ok', type: 'boolean', description: 'False when the cycle failed.' },
          { name: 'committed', type: 'boolean', description: 'A sync commit was made.' },
          { name: 'pushed', type: 'boolean', description: 'Local commits were pushed.' },
          {
            name: 'conflicts',
            type: 'string[]',
            description: 'Paths written as <file>.conflict.md.',
          },
          {
            name: 'reason / error',
            type: 'string',
            description: 'Failure kind and message when ok is false (e.g. "unreachable").',
          },
        ],
        errors: [{ status: '400', meaning: 'vault is required, or no sync origin configured' }],
      },
    ],
  },
  {
    group: 'MCP',
    items: [
      {
        method: 'POST',
        path: '/mcp',
        status: 'live',
        summary: 'Local MCP over Streamable HTTP',
        description:
          'The same frozen six memory__* tools as the cloud endpoint, served locally as stateless Streamable HTTP JSON-RPC. GET and DELETE return 405 (stateless: POST only). See the MCP tools reference for the tool contracts.',
        params: [
          {
            name: '(body)',
            type: 'JSON-RPC 2.0',
            description: 'A JSON-RPC request, e.g. tools/list or tools/call.',
          },
        ],
        curl: `curl -s -X POST ${BASE}/mcp \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json, text/event-stream" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'`,
        response: `{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      { "name": "memory__search" },
      { "name": "memory__read" },
      { "name": "memory__write" },
      { "name": "memory__edit" },
      { "name": "memory__list" },
      { "name": "memory__delete" }
    ]
  }
}`,
        fields: [
          {
            name: 'result.tools',
            type: 'array',
            description: 'The six memory__* tool contracts (names, schemas, annotations).',
          },
        ],
        errors: [
          { status: '405', meaning: 'GET or DELETE - the endpoint is stateless (POST only)' },
          { status: '500', meaning: 'internal error' },
        ],
      },
    ],
  },
];

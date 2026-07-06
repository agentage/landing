// Contracts for the six frozen MCP tools, rendered as the interactive list on
// /docs/mcp-tools. Input schemas, defaults, and constraints are transcribed
// verbatim from the CI-frozen snapshot at
// agentage/web/packages/memory-mcp/.mcpc.json - do not add or invent fields.
// Collapsed-row summaries reuse the one-liners in lib/mcp-docs.ts (MCP_TOOLS).

import { MCP_TOOLS } from './mcp-docs';
import type { ToolGroup } from '@/docs/types';

const summaryOf = (name: string): string => MCP_TOOLS.find(([n]) => n === name)?.[1] ?? '';

export const MCP_TOOL_GROUPS: ToolGroup[] = [
  {
    group: 'Read',
    items: [
      {
        name: 'memory__search',
        verb: 'search',
        color: 'read',
        summary: summaryOf('memory__search'),
        description:
          'Find memories by literal text, ranked by match count. Matches the query as one case-insensitive substring across titles, bodies, and tags - not semantic, not tokenized - so search a single keyword, not a phrase. Returns path + snippet + score, never full bodies.',
        behavior:
          'Returns ranked paths and snippets only, never full bodies; score is the match count, not a relevance percent. To browse the folder tree instead, use memory__list.',
        args: [
          {
            name: 'query',
            type: 'string',
            required: 'required',
            description:
              'Literal text to match as one case-insensitive substring across titles, bodies, and tags. Search a single distinctive keyword, not a phrase.',
          },
          {
            name: 'folder',
            type: 'string',
            required: 'optional',
            description:
              'Restrict to this POSIX folder (no leading slash), e.g. work/tasks. Matches that folder only. Omit for the whole memory.',
          },
          {
            name: 'tags',
            type: 'string[]',
            required: 'optional',
            description:
              'Frontmatter or inline #tags, AND-matched (all must be present), case-sensitive, bare without #. Up to 50.',
          },
          {
            name: 'limit',
            type: 'integer, 1-50',
            required: 'optional, default 20',
            description: 'Max results in this page; capped at 50.',
          },
          {
            name: 'cursor',
            type: 'string',
            required: 'optional',
            description:
              "Opaque pagination token - pass the previous response's nextCursor verbatim. Omit for the first page.",
          },
        ],
        input: `{ "query": "pkce", "limit": 5 }`,
        result: `{
  "results": [
    {
      "path": "work/tasks/auth.md",
      "title": "Auth",
      "snippet": "...enable pkce for the oauth flow...",
      "score": 3,
      "updated": "2026-07-05T21:47:55+00:00"
    }
  ],
  "nextCursor": "eyJvIjoyMH0"
}`,
      },
      {
        name: 'memory__read',
        verb: 'read',
        color: 'read',
        summary: summaryOf('memory__read'),
        description:
          'Read one memory by its exact path: returns full frontmatter, markdown body, tags, and last-updated timestamp. Use a path from memory__search / memory__list, a prior write, or the user - do not guess one from a title.',
        args: [
          {
            name: 'path',
            type: 'string',
            required: 'required',
            description:
              'Exact POSIX .md address (case-sensitive, no leading slash), e.g. work/tasks/foo.md. Not a title or query.',
          },
        ],
        input: `{ "path": "work/tasks/auth.md" }`,
        result: `{
  "path": "work/tasks/auth.md",
  "title": "Auth",
  "frontmatter": { "type": "task", "tags": ["project", "active"] },
  "body": "# Auth\\n\\nEnable PKCE for the OAuth flow.",
  "tags": ["project", "active"],
  "updated": "2026-07-05T21:47:55+00:00",
  "deleted": false
}`,
      },
      {
        name: 'memory__list',
        verb: 'list',
        color: 'read',
        summary: summaryOf('memory__list'),
        description:
          'Browse the memory as a folder tree: files and subfolders under a folder, two levels deep by default, with per-folder file counts. No bodies, no ranking.',
        behavior:
          'A folder tree two levels deep with recursive file counts; folders over the per-folder entry limit are flagged truncated and not expanded - call memory__list again with that folder to see inside.',
        args: [
          {
            name: 'folder',
            type: 'string',
            required: 'optional',
            description:
              'Folder to browse (POSIX, no leading slash), e.g. work/tasks. Matches that folder only. Omit for the memory root.',
          },
          {
            name: 'depth',
            type: 'integer, 1-2',
            required: 'optional, default 2',
            description:
              '1 = direct children of the folder only; 2 = also expand each subfolder one more level.',
          },
          {
            name: 'tags',
            type: 'string[]',
            required: 'optional',
            description:
              'Frontmatter or inline #tags, AND-matched (all must be present), case-sensitive, bare without #. Up to 50.',
          },
        ],
        input: `{ "folder": "work", "depth": 2 }`,
        result: `{
  "folder": "work",
  "entries": [
    {
      "type": "folder",
      "path": "work/tasks",
      "files": 12,
      "entries": [
        {
          "type": "file",
          "path": "work/tasks/auth.md",
          "title": "Auth",
          "updated": "2026-07-05T21:47:55+00:00"
        }
      ]
    },
    {
      "type": "file",
      "path": "work/plan.md",
      "title": "Plan",
      "updated": "2026-07-04T10:00:00+00:00"
    }
  ],
  "truncated": false,
  "files": 13
}`,
      },
    ],
  },
  {
    group: 'Write',
    items: [
      {
        name: 'memory__write',
        verb: 'write',
        color: 'write',
        summary: summaryOf('memory__write'),
        description:
          "This is the user's persistent memory - save durable facts, notes, preferences, and decisions here. Creates a new memory or fully overwrites the one at path, replacing the entire body and frontmatter.",
        behavior:
          'Idempotent full replace - overwrites the whole body and frontmatter. To change only part of an existing memory, use memory__edit.',
        args: [
          {
            name: 'path',
            type: 'string',
            required: 'required',
            description:
              'Exact POSIX .md address (case-sensitive, no leading slash), e.g. work/tasks/foo.md.',
          },
          {
            name: 'body',
            type: 'string',
            required: 'required',
            description:
              'The complete Markdown body, excluding frontmatter (no --- fences). Overwrites the entire existing body.',
          },
          {
            name: 'frontmatter',
            type: 'object',
            required: 'optional',
            description:
              'YAML metadata as a key -> value map (no --- fences). write replaces the whole map.',
          },
        ],
        input: `{
  "path": "projects/acme/stack.md",
  "body": "# Stack\\n\\nWe use Postgres for full-text search.",
  "frontmatter": { "type": "note", "tags": ["project"] }
}`,
        result: `{ "path": "projects/acme/stack.md", "updated": "2026-07-06T08:00:00+00:00" }`,
      },
      {
        name: 'memory__edit',
        verb: 'edit',
        color: 'edit',
        summary: summaryOf('memory__edit'),
        description:
          'Amend an existing memory in place. mode=str_replace swaps one exact text match without resending the note; append adds to the end; replace overwrites the whole body; frontmatter always shallow-merges. Fails not-found if the path does not exist - use memory__write to create.',
        behavior:
          'Frontmatter shallow-merges top-level keys (nested values replaced wholesale) and a key cannot be removed via edit - use memory__write to fully replace.',
        args: [
          {
            name: 'path',
            type: 'string',
            required: 'required',
            description:
              'Exact POSIX .md address of an existing memory (case-sensitive, no leading slash).',
          },
          {
            name: 'body',
            type: 'string',
            required: 'optional',
            description:
              'New body (mode=replace) or appended text (mode=append). Not used with str_replace; omit to change only frontmatter.',
          },
          {
            name: 'frontmatter',
            type: 'object',
            required: 'optional',
            description: 'YAML key -> value map (no --- fences). Shallow-merges top-level keys.',
          },
          {
            name: 'mode',
            type: "'replace' | 'append' | 'str_replace'",
            required: 'optional, default replace',
            description:
              'How to apply body: str_replace swaps old_str for new_str in place; append adds to the end; replace overwrites the whole body.',
          },
          {
            name: 'old_str',
            type: 'string',
            required: 'optional (str_replace)',
            description:
              'Exact existing body text to replace - must match verbatim (including whitespace) and appear exactly once.',
          },
          {
            name: 'new_str',
            type: 'string',
            required: 'optional (str_replace)',
            description: 'The replacement text. Omit to delete old_str.',
          },
        ],
        input: `{
  "path": "projects/acme/stack.md",
  "mode": "str_replace",
  "old_str": "Postgres",
  "new_str": "Postgres 16"
}`,
        result: `{ "path": "projects/acme/stack.md", "updated": "2026-07-06T08:01:00+00:00" }`,
      },
      {
        name: 'memory__delete',
        verb: 'delete',
        color: 'delete',
        summary: summaryOf('memory__delete'),
        description:
          'Soft-delete (forget) a memory by path. Returns not-found if the path does not exist. To remove only part of a memory, use memory__edit.',
        behavior:
          'Recoverable soft-delete - the memory is tombstoned in git history, not destroyed.',
        args: [
          {
            name: 'path',
            type: 'string',
            required: 'required',
            description:
              'Exact POSIX .md address to soft-delete (case-sensitive, no leading slash).',
          },
        ],
        input: `{ "path": "projects/acme/old.md" }`,
        result: `{ "path": "projects/acme/old.md", "deleted": true }`,
      },
    ],
  },
];

import type { DocPage } from '../types';
import {
  EXAMPLE_PROMPTS,
  MCP_AUTH_ORIGIN,
  MCP_ENDPOINT,
  MCP_ENDPOINT_URL,
  TOOL_SCOPE_NOTE,
} from '@/lib/mcp-docs';
import { MCP_TOOL_GROUPS } from '@/lib/mcp-tool-contracts';

// Interactive reference for the six frozen memory__* MCP tools, rendered from
// lib/mcp-tool-contracts.ts (transcribed from the .mcpc.json CI snapshot). Facts
// (endpoint, auth, example prompts) come from lib/mcp-docs.ts.
const tryItMd = EXAMPLE_PROMPTS.slice(0, 3)
  .map(({ prompt, outcome, tools }) => `- "${prompt}" - ${outcome} (\`${tools}\`)`)
  .join('\n');

export const mcpToolsDoc: DocPage = {
  slug: 'mcp-tools',
  title: 'MCP tools',
  lede: 'The six memory operations every connected client gets - each with its exact arguments, an example call, and the JSON it returns. The tool contract is frozen.',
  keywords: [
    'MCP tools',
    'memory__search',
    'memory__read',
    'memory__write',
    'memory__edit',
    'memory__list',
    'memory__delete',
    'MCP tool reference',
    'agentage memory tools',
  ],
  sections: [
    {
      id: 'overview',
      title: 'Six tools, one memory',
      blocks: [
        {
          type: 'code',
          language: 'text',
          code: `POST ${MCP_ENDPOINT_URL}`,
        },
        {
          type: 'p',
          md: `Connect any MCP client to the single endpoint \`${MCP_ENDPOINT}\` (Streamable HTTP, OAuth 2.1 with PKCE, sign-in at ${MCP_AUTH_ORIGIN}) and it gets these six \`memory__*\` tools. They read and write one shared markdown memory - the same notes across every AI you connect. New here? Start with the [MCP server](/docs/mcp-server) guide; for the read-only HTTP surface see the [REST API](/docs/rest-api).`,
        },
        {
          type: 'callout',
          variant: 'info',
          md: TOOL_SCOPE_NOTE,
        },
      ],
    },
    {
      id: 'tools',
      title: 'The tools',
      blocks: [
        {
          type: 'p',
          md: 'Grouped by read and write. Click a row to expand its contract - description, arguments, an example input, the JSON result, and behavior notes. All six are live; the schema is CI-frozen, so fields are only ever added, never renamed or removed.',
        },
        {
          type: 'tools',
          groups: MCP_TOOL_GROUPS,
        },
      ],
    },
    {
      id: 'addressing',
      title: 'Addressing multiple memories',
      blocks: [
        {
          type: 'p',
          md: 'Own more than one vault? Prefix any path with `@<vault>` to address a specific one. The `@` lives inside the existing `path` and `folder` arguments, so the six tool schemas are unchanged.',
        },
        {
          type: 'code',
          language: 'json',
          code: `memory__write { "path": "@work/notes/plan.md", "body": "..." }
memory__read  { "path": "@work/notes/plan.md" }`,
          caption:
            'An @<vault>/ prefix routes the call into that vault; returned paths come back @-prefixed so they round-trip.',
        },
        {
          type: 'code',
          language: 'json',
          code: `memory__search { "query": "roadmap", "folder": "@work" }`,
          caption:
            'folder: "@<vault>" scopes a search or list to one whole vault; hits come back @-prefixed.',
        },
        {
          type: 'p',
          md: '- A bare path (no `@`) addresses your default memory, unchanged.\n- `memory__list` with no folder lists each of your vaults as an `@<vault>/` root folder.\n- A bare `@<vault>` names a vault, not a file: `memory__read` / `write` / `edit` / `delete` reject it, while `memory__search` / `list` treat it as whole-vault scope.\n- Vault names are 1-64 characters from `A-Z a-z 0-9 _ -`.',
        },
        {
          type: 'callout',
          variant: 'info',
          md: 'An unscoped `memory__search` (no `@`) covers your default memory only. To search another vault, scope it with `folder: "@<vault>"`.',
        },
      ],
    },
    {
      id: 'try-it',
      title: 'Try it',
      blocks: [
        {
          type: 'p',
          md: 'Once connected, ask your assistant in plain language - it picks the right tools and chains them for you:',
        },
        {
          type: 'p',
          md: tryItMd,
        },
      ],
    },
  ],
};

// Single source of truth for "how to connect" content, shared by the docs
// page, llms.txt, llms-full.txt, and the /docs.md mirror.

export const MCP_ENDPOINT = 'memory.agentage.io/mcp';
export const MCP_ENDPOINT_URL = `https://${MCP_ENDPOINT}`;

export const MCP_AUTH_NOTE =
  'OAuth 2.1 with PKCE and dynamic client registration - sign in once in the browser, no API key.';

// One-line positioning, shared by the docs page header + the markdown mirrors. Leads with
// the differentiator: cross-vendor (names the clients) + files-first ownership.
export const DOCS_INTRO =
  'Connect any MCP client to one shared markdown memory through a single endpoint. Sign in with OAuth and Claude, ChatGPT, Cursor, and your other AI tools read and write the same notes - plain markdown you own and can export anytime.';

// What the tools do NOT do: they fire only on memory-relevant requests, never on ordinary
// questions. Documents the negative behavior reviewers probe (no spurious tool calls).
export const TOOL_SCOPE_NOTE =
  'The memory tools run only when your request is about your notes - everyday questions like facts, math, or writing are answered normally, without touching your memory.';

export const MCP_TOOLS: ReadonlyArray<readonly [string, string]> = [
  ['memory__search', 'Find notes by keyword across the whole memory.'],
  ['memory__read', 'Read a note by path.'],
  ['memory__write', 'Create or replace a note.'],
  ['memory__edit', 'Apply a targeted edit to a note.'],
  ['memory__list', 'Browse the folder tree - subfolders with file counts, two levels deep.'],
  ['memory__delete', 'Remove a note.'],
];

export const EXAMPLE_PROMPTS: ReadonlyArray<{
  prompt: string;
  outcome: string;
  tools: string;
}> = [
  {
    prompt: 'Search my memory for "postgres" and read the top result.',
    outcome:
      'Ranks notes mentioning postgres by match count, then returns the top note in full (frontmatter + markdown body).',
    tools: 'memory__search -> memory__read',
  },
  {
    prompt: 'Save a note at projects/acme/stack.md: we use Postgres for full-text search.',
    outcome:
      'Creates (or fully replaces) that note. It persists server-side and is readable from every AI you connect to the same account.',
    tools: 'memory__write',
  },
  {
    prompt: 'List everything under projects/ and tag the roadmap note as launched.',
    outcome:
      'Shows the folder tree under projects/ (subfolders with file counts + notes), then shallow-merges a launched tag into the roadmap note frontmatter without rewriting the body.',
    tools: 'memory__list -> memory__edit',
  },
];

export const LIMITATIONS: readonly string[] = [
  'Notes are plain markdown addressed by path (e.g. work/tasks/foo.md), not by title or ID.',
  'Search is literal keyword/substring matching - not semantic or vector search; search one distinctive keyword, not a phrase.',
  'search returns ranked paths + snippets, never full bodies - use read for the whole note.',
  'list shows the folder tree two levels deep, up to 100 entries per folder - call it again with a subfolder to browse deeper.',
  'edit shallow-merges top-level frontmatter keys and cannot remove a key; use write to fully replace a note.',
  'delete is a recoverable soft-delete (kept in history), not a hard wipe.',
  'One memory per account; connect the same account in each client to share it. Data is stored in the EU and exportable anytime.',
];

export const CLAUDE_CODE_COMMAND = `claude mcp add --transport http memory ${MCP_ENDPOINT_URL}`;

export const CLAUDE_CONNECTORS_URL =
  'https://claude.ai/customize/connectors?modal=add-custom-connector';
export const CHATGPT_CONNECTORS_URL = 'https://chatgpt.com/#settings/Connectors';

export const VSCODE_MCP_JSON = `{
  "servers": {
    "agentage-memory": {
      "type": "http",
      "url": "${MCP_ENDPOINT_URL}"
    }
  }
}`;

export const CLIENT_GUIDES: ReadonlyArray<{
  client: string;
  steps: readonly string[];
}> = [
  {
    client: 'Claude Code',
    steps: [`Run \`${CLAUDE_CODE_COMMAND}\``, 'Run `/mcp` and complete the OAuth sign-in.'],
  },
  {
    client: 'Claude (claude.ai & Desktop)',
    steps: [
      `Open [Settings > Connectors](${CLAUDE_CONNECTORS_URL}) > Add custom connector.`,
      `Paste \`${MCP_ENDPOINT_URL}\` and sign in when prompted.`,
    ],
  },
  {
    client: 'VS Code',
    steps: [
      'Add the server to `.vscode/mcp.json` (or run the `MCP: Add Server` command):',
      `\`\`\`json\n${VSCODE_MCP_JSON}\n\`\`\``,
      'VS Code opens the browser for the OAuth sign-in on first use.',
    ],
  },
  {
    client: 'ChatGPT',
    steps: [
      `Open [Settings > Connectors](${CHATGPT_CONNECTORS_URL}) > Add custom connector (paid plans; enable Developer mode under Advanced if the option is hidden).`,
      `Paste \`${MCP_ENDPOINT_URL}\` and sign in when prompted.`,
    ],
  },
];

export function getDocsMarkdown(siteUrl: string): string {
  const guides = CLIENT_GUIDES.map(({ client, steps }) => {
    // Indent continuation lines (e.g. fenced code blocks) so they stay inside
    // the numbered list item.
    const list = steps.map((s, i) => `${i + 1}. ${s.split('\n').join('\n   ')}`).join('\n');
    return `### ${client}\n\n${list}`;
  }).join('\n\n');

  const tools = MCP_TOOLS.map(([name, desc]) => `- \`${name}\`: ${desc}`).join('\n');

  const examples = EXAMPLE_PROMPTS.map(
    ({ prompt, outcome, tools: t }) => `- "${prompt}"\n  - Outcome: ${outcome} (\`${t}\`)`
  ).join('\n');

  const limitations = LIMITATIONS.map((l) => `- ${l}`).join('\n');

  return `# Agentage Memory - Docs

${DOCS_INTRO}

## Connect

- MCP endpoint: \`${MCP_ENDPOINT_URL}\` (Streamable HTTP)
- Auth: ${MCP_AUTH_NOTE}

${guides}

## MCP tools

Once connected, every client gets six memory operations:

${tools}

## Example prompts

${examples}

${TOOL_SCOPE_NOTE}

## Limitations

${limitations}

HTML version: ${siteUrl}/docs
`;
}

import { SITE_NAME, getSiteUrl } from '../../lib/site';
import { getAllPosts } from '../../lib/blog';
import { docPages } from '../../docs/registry';
import { docMdHref } from '../../docs/nav-order';
import {
  MCP_AUTH_NOTE,
  MCP_ENDPOINT_URL,
  MCP_TOOLS,
  CLAUDE_CODE_COMMAND,
} from '../../lib/mcp-docs';

// llms.txt (https://llmstxt.org) - dynamic so the runtime SITE_FQDN is read per request.
export const dynamic = 'force-dynamic';

export async function GET() {
  const SITE_URL = getSiteUrl();
  const posts = await getAllPosts();

  const blogSection = posts
    .map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.description ?? ''}`.trimEnd())
    .join('\n');

  const tools = MCP_TOOLS.map(([name, desc]) => `  - ${name}: ${desc}`).join('\n');

  // Per-page markdown mirrors - append .md to any docs URL.
  const docPagesMd = docPages()
    .map((p) => `- [${p.title}](${SITE_URL}${docMdHref(p.slug)}): ${p.lede}`)
    .join('\n');

  const body = `# ${SITE_NAME}

> One shared markdown memory for Claude, ChatGPT, Cursor and every AI - a single MCP endpoint your tools read and write. Files-first, EU-private, export anytime. Owned by you.

${SITE_NAME} is the shared memory layer for AI tools. The canonical store is your own per-tenant database in the EU, mirrored to plain markdown files on your machine. Claude, ChatGPT, Cursor, and any MCP client connect to one endpoint and share the same memory.

## Connect

- MCP endpoint: ${MCP_ENDPOINT_URL} (Streamable HTTP)
- Auth: ${MCP_AUTH_NOTE}
- Claude Code: \`${CLAUDE_CODE_COMMAND}\`
- Other clients (Claude, ChatGPT, VS Code): add a custom connector pointing at the endpoint; see [Docs](${SITE_URL}/docs).
- Tools exposed once connected:
${tools}

## Docs
- [Setup & MCP tools](${SITE_URL}/docs): connect Claude, ChatGPT, Cursor, and Obsidian to one shared memory; the six memory__* MCP tools (search, read, write, edit, list, delete). Markdown: [/docs.md](${SITE_URL}/docs.md)

Per-page Markdown mirrors (append .md to any docs URL):
${docPagesMd}

## Pages
- [Home](${SITE_URL}/): what it is, how it works.
- [Privacy](${SITE_URL}/privacy): EU-resident data handling, Google API Limited Use, sub-processors.
- [Terms](${SITE_URL}/terms): terms of service.
- [Contact](${SITE_URL}/contacts): how to reach the team - general, security, GitHub.

## Blog
${blogSection}

Markdown mirrors: append .md to any blog URL (e.g. ${SITE_URL}/blog/<slug>.md). Full corpus in one fetch: [llms-full.txt](${SITE_URL}/llms-full.txt).

## Key facts
- One MCP endpoint shared across every AI client; no per-tool re-pasting of context.
- Files-first: a local markdown mirror you own and can export anytime.
- EU-private: canonical store and index run on EU infrastructure.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

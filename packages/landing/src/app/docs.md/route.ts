import { getSiteUrl } from '../../lib/site';
import { getDocsMarkdown } from '../../lib/mcp-docs';

// Markdown mirror of /docs for agents. noindex: the HTML page is canonical.
export const dynamic = 'force-dynamic';

export function GET() {
  return new Response(getDocsMarkdown(getSiteUrl()), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'noindex',
    },
  });
}

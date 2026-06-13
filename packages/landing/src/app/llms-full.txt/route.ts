import { SITE_NAME, SITE_TAGLINE, getSiteUrl } from '../../lib/site';
import { getAllPosts, getPost, formatPostDate } from '../../lib/blog';
import { getDocsMarkdown } from '../../lib/mcp-docs';

// llms-full.txt — the whole public corpus in one fetch, for agents that prefer
// a single document over crawling. Dynamic so runtime SITE_FQDN is respected.
export const dynamic = 'force-dynamic';

export async function GET() {
  const SITE_URL = getSiteUrl();
  const metas = await getAllPosts();
  const posts = (await Promise.all(metas.map((m) => getPost(m.slug)))).filter(
    (p): p is NonNullable<typeof p> => p !== null
  );

  const blogSections = posts
    .map(
      (p) =>
        `# ${p.title}\n\n` +
        `${p.date ? `Published ${formatPostDate(p.date)}. ` : ''}Source: ${SITE_URL}/blog/${p.slug}\n\n` +
        p.content.trim()
    )
    .join('\n\n---\n\n');

  const body = `# ${SITE_NAME}

> ${SITE_TAGLINE}

This file contains the full public content of ${SITE_URL} in one document: docs, then blog posts. Index version: ${SITE_URL}/llms.txt

---

${getDocsMarkdown(SITE_URL)}

---

${blogSections}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

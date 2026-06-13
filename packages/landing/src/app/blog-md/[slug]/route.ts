import { getPost, formatPostDate } from '../../../lib/blog';
import { getSiteUrl } from '../../../lib/site';

// Serves /blog/<slug>.md via the next.config rewrite. Markdown mirror for
// agents; noindex because the HTML post is canonical.
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post || post.draft) {
    return new Response('Not found', { status: 404 });
  }

  const SITE_URL = getSiteUrl();
  const header = [
    `# ${post.title}`,
    '',
    ...(post.subtitle ? [post.subtitle, ''] : []),
    `Published ${formatPostDate(post.date)} by ${post.author}. Source: ${SITE_URL}/blog/${post.slug}`,
    '',
  ].join('\n');

  return new Response(`${header}\n${post.content.trim()}\n`, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'noindex',
    },
  });
}

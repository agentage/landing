import { docPageToMarkdown } from '@/docs/to-markdown';
import { docSlugs, getDoc } from '@/docs/registry';

// Per-page markdown mirror served at /docs/<slug>.md via the next.config rewrite.
// Fully static: built from the same build-time DocPage data as the HTML page, so
// it prerenders at build (no runtime origin, links stay relative). noindex - the
// HTML page is canonical.
export const dynamic = 'force-static';

export function generateStaticParams(): { slug: string }[] {
  return docSlugs().map((slug) => ({ slug }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<Response> {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) return new Response('Not found', { status: 404 });

  return new Response(docPageToMarkdown(doc), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'noindex',
    },
  });
}

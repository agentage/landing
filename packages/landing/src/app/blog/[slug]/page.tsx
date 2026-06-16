import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogMdx } from '@/components/blog-mdx';
import { formatPostDate, getAllPostSlugs, getPost } from '@/lib/blog';
import { SITE_NAME, SITE_URL } from '@/lib/site';

type Params = { slug: string };

// Only the slugs from generateStaticParams (published, non-draft) render; any
// other slug - including a draft addressed directly - 404s instead of leaking.
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const url = `/blog/${post.slug}`;
  const images = post.ogImageUrl ? [{ url: post.ogImageUrl, alt: post.title }] : undefined;

  return {
    title: `${post.title} - ${SITE_NAME}`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [post.author],
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.ogImageUrl ? [post.ogImageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: 'Agentage', url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
    ...(post.ogImageUrl ? { image: `${SITE_URL}${post.ogImageUrl}` } : {}),
  };

  return (
    <article className="mx-auto max-w-5xl px-6 py-20 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to blog
      </Link>

      <header className="mb-10 border-b border-border pb-8">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary">Blog</p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
          {post.title}
        </h1>
        {post.subtitle && (
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{post.subtitle}</p>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>{post.author}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime}</span>
          {post.updated && post.updated !== post.date && (
            <>
              <span aria-hidden="true">·</span>
              <span>
                Updated <time dateTime={post.updated}>{formatPostDate(post.updated)}</time>
              </span>
            </>
          )}
        </div>
        {post.tags.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border bg-sidebar/50 px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </header>

      {post.coverUrl && (
        // Plain anchor (not next/link): a hard nav to /#waitlist avoids next/link's
        // hash-accumulation bug (revisiting stacks /#waitlist#waitlist) and mounts the
        // homepage fresh so the waitlist input centers + focuses every time.
        <a
          href="/#waitlist"
          aria-label="Join the Agentage Memory waitlist"
          className="group mb-10 block overflow-hidden rounded-2xl border border-border bg-sidebar/50"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverUrl}
            alt={post.title}
            className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </a>
      )}

      <div className="prose-blog">
        <BlogMdx source={post.content} />
      </div>

      <footer className="mt-16 border-t border-border pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← All posts
        </Link>
      </footer>
    </article>
  );
}

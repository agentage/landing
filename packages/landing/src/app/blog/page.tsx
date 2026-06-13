import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, formatPostDate, type BlogPostMeta } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog - Agentage Memory',
  description:
    'Build-in-public notes on shared AI memory, MCP, and shipping Agentage Memory - one markdown memory every AI reads and writes.',
  alternates: { canonical: '/blog' },
  openGraph: { url: '/blog', title: 'Blog - Agentage Memory' },
};

function CoverFrame({ url, alt, className }: { url?: string; alt: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-sidebar/50 ${className ?? ''}`}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={alt}
          className="h-full w-full object-cover object-center"
          loading="lazy"
        />
      ) : (
        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-sidebar via-card to-background">
          <span className="font-mono text-2xl text-primary/40 select-none">A♥</span>
        </div>
      )}
    </div>
  );
}

function Meta({ post }: { post: BlogPostMeta }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      <time dateTime={post.date}>{formatPostDate(post.date)}</time>
      <span aria-hidden="true">·</span>
      <span>{post.readingTime}</span>
    </div>
  );
}

function GridCard({ post }: { post: BlogPostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/40"
    >
      <CoverFrame url={post.coverUrl} alt={post.title} className="aspect-[16/9]" />
      <div className="flex flex-1 flex-col gap-2 p-6">
        <Meta post={post} />
        <h2 className="text-lg font-bold leading-snug tracking-tight text-foreground">
          {post.title}
        </h2>
        {post.subtitle && (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {post.subtitle}
          </p>
        )}
      </div>
    </Link>
  );
}

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto max-w-4xl px-6 py-20 md:py-24">
      <header className="mb-12 max-w-2xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary">Blog</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Build-in-public notes</h1>
        <p className="mt-4 text-muted-foreground">
          Shipping Agentage Memory in the open - one markdown memory every AI shares. Notes on MCP,
          owning your data, and the road to a shared memory layer for every AI.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet - first one is on the way.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug} className="flex">
              <GridCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

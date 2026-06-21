import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

export type BlogFaqItem = { question: string; answer: string };

export type BlogFrontmatter = {
  title: string;
  subtitle?: string;
  description?: string;
  date: string;
  updated?: string;
  tags?: string[];
  cover?: string;
  ogImage?: string;
  readingTime?: string;
  author?: string;
  draft?: boolean;
  faq?: BlogFaqItem[];
};

export type BlogPostMeta = {
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  date: string;
  updated?: string;
  tags: string[];
  readingTime: string;
  author: string;
  coverUrl?: string;
  ogImageUrl?: string;
  draft: boolean;
  faq?: BlogFaqItem[];
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), 'src/content/blog');
const WORDS_PER_MINUTE = 220;
const DEFAULT_AUTHOR = 'Volodymyr Vreshch';

function calculateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

// YAML parses an unquoted ISO date (`date: 2026-05-30`) into a JS Date, not a
// string. Coerce to a stable ISO string at the boundary so every downstream
// surface (<time dateTime>, OG article meta, JSON-LD, sort) stays valid no
// matter how an author quotes the frontmatter.
function normalizeDate(value: string | Date): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date in frontmatter: ${String(value)}`);
  }
  return date.toISOString();
}

function resolveAssetUrl(slug: string, asset: string | undefined): string | undefined {
  if (!asset) return undefined;
  if (/^https?:\/\//.test(asset) || asset.startsWith('/')) return asset;
  const cleaned = asset.replace(/^\.?\//, '');
  return `/blog/${slug}/${cleaned}`;
}

async function readPostFile(slug: string): Promise<BlogPost> {
  const filePath = path.join(CONTENT_DIR, slug, 'article.md');
  const raw = await readFile(filePath, 'utf-8');
  const { data, content } = matter(raw);

  const fm = data as BlogFrontmatter;
  if (!fm.title || !fm.date) {
    throw new Error(`Post "${slug}" is missing required frontmatter: title or date.`);
  }

  const coverUrl = resolveAssetUrl(slug, fm.cover);
  const ogImageUrl = resolveAssetUrl(slug, fm.ogImage) ?? coverUrl;

  return {
    slug,
    title: fm.title,
    subtitle: fm.subtitle,
    description: fm.description ?? fm.subtitle,
    date: normalizeDate(fm.date),
    updated: fm.updated ? normalizeDate(fm.updated) : undefined,
    tags: fm.tags ?? [],
    readingTime: fm.readingTime ?? calculateReadingTime(content),
    author: fm.author ?? DEFAULT_AUTHOR,
    coverUrl,
    ogImageUrl,
    draft: fm.draft ?? false,
    faq: fm.faq,
    content,
  };
}

function toMeta(post: BlogPost): BlogPostMeta {
  const { content: _content, ...meta } = post;
  return meta;
}

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  const entries = await readdir(CONTENT_DIR, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  // getPost is null-safe for a dir missing article.md, so one stray folder
  // can't take down the whole index/sitemap.
  const posts = await Promise.all(dirs.map((slug) => getPost(slug)));
  return posts
    .filter((post): post is BlogPost => post !== null && !post.draft)
    .map(toMeta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Published (non-draft) slugs, derived from the single parse in getAllPosts so
// generateStaticParams and the index never disagree.
export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((post) => post.slug);
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    return await readPostFile(slug);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

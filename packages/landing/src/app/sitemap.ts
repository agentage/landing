import type { MetadataRoute } from 'next';
import { getDocsUrl, getSiteUrl } from '../lib/site';
import { getAllPosts } from '../lib/blog';
import { docSlugs } from '../docs/registry';
import { docUrl } from '../docs/host-routing';

// Dynamic so the runtime SITE_FQDN is read per request, not baked at build.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  // Docs are canonical on their own host; one sitemap still lists both (robots.txt
  // cross-submission), so every doc <loc> is a docs-origin URL.
  const docsBase = getDocsUrl();
  const posts = await getAllPosts();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated ?? post.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Every docs sub-page (Overview is /docs below; these are the rest).
  const docEntries: MetadataRoute.Sitemap = docSlugs().map((slug) => ({
    url: docUrl(docsBase, slug),
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: docUrl(docsBase, ''),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...docEntries,
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...postEntries,
    {
      url: `${baseUrl}/contacts`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}

import type { DocPage } from './types';
import { overviewDoc } from './content/overview';
import { mcpServerDoc } from './content/mcp-server';
import { connectDoc } from './content/connect';
import { clientDocs } from './content/clients';
import { restApiDoc } from './content/rest-api';
import { mcpToolsDoc } from './content/mcp-tools';
import { cliDoc } from './content/cli';

// Every doc page, keyed by slug. Add a page = import it + add it here; the route
// and sitemap pick it up automatically (nav is wired in nav.ts).
const PAGES: DocPage[] = [
  overviewDoc,
  mcpServerDoc,
  connectDoc,
  ...clientDocs,
  restApiDoc,
  mcpToolsDoc,
  cliDoc,
];

const BY_SLUG = new Map(PAGES.map((p) => [p.slug, p]));

export const getDoc = (slug: string): DocPage | undefined => BY_SLUG.get(slug);

/** Slugs for non-index pages, for generateStaticParams on /[slug]. */
export const docSlugs = (): string[] => PAGES.map((p) => p.slug).filter((s) => s !== '');

/** Every page in registry order (index first), for the .md mirrors + llms.txt. */
export const docPages = (): DocPage[] => PAGES;

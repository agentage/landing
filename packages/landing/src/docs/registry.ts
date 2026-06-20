import type { DocPage } from './types';
import { overviewDoc } from './content/overview';
import { mcpServerDoc } from './content/mcp-server';
import { clientDocs } from './content/clients';

// Every doc page, keyed by slug. Add a page = import it + add it here; the route
// and sidebar pick it up automatically.
const PAGES: DocPage[] = [overviewDoc, mcpServerDoc, ...clientDocs];

const BY_SLUG = new Map(PAGES.map((p) => [p.slug, p]));

export const getDoc = (slug: string): DocPage | undefined => BY_SLUG.get(slug);

/** Slugs for non-index pages, for generateStaticParams on /[slug]. */
export const docSlugs = (): string[] => PAGES.map((p) => p.slug).filter((s) => s !== '');

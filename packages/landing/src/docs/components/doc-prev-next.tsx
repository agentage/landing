import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { docsNav } from '../nav';
import { docHref, prevNext } from '../nav-order';

// End-of-page pagination derived from the flattened nav order. Previous on the
// left, next on the right; renders nothing when a page has no neighbours.
export function DocPrevNext({ slug }: { slug: string }): React.JSX.Element | null {
  const { prev, next } = prevNext(slug, docsNav);
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Docs pages"
      className="mt-14 grid grid-cols-2 gap-4 border-t border-border pt-6"
    >
      {prev ? (
        <Link
          href={docHref(prev.slug)}
          className="group flex flex-col items-start rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-primary/50"
        >
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Previous
          </span>
          <span className="mt-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <ArrowLeft className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
            {prev.label}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={docHref(next.slug)}
          className="group col-start-2 flex flex-col items-end rounded-lg border border-border bg-card px-4 py-3 text-right transition-colors hover:border-primary/50"
        >
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Next
          </span>
          <span className="mt-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
            {next.label}
            <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

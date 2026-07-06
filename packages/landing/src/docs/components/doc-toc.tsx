import type { DocSection } from '../types';
import { DocTocActive } from './doc-toc-active';

// Right-rail "On this page" outline. Server-rendered from the doc sections;
// links are plain anchors that work without JS. Shown only from xl up (no mobile
// drawer). The DocTocActive enhancer highlights the section in view.
export function DocToc({ sections }: { sections: DocSection[] }): React.JSX.Element {
  const ids = sections.map((s) => s.id);
  return (
    <aside className="sticky top-[69px] hidden h-fit w-56 shrink-0 xl:block">
      <nav aria-label="On this page" className="border-l border-border py-1">
        <p className="mb-2 pl-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          On this page
        </p>
        <ul className="space-y-1 text-sm">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                data-toc-link={s.id}
                className="-ml-px block border-l border-transparent py-1 pl-4 text-muted-foreground transition-colors hover:text-foreground"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <DocTocActive ids={ids} />
    </aside>
  );
}

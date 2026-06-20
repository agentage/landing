'use client';

import { Info, TriangleAlert, CircleCheck } from 'lucide-react';
import { Alert, CodeBlock, Md, Tabs, TabsContent, TabsList, TabsTrigger } from './ui';
import type { CalloutVariant, DocBlock, DocPage } from '../types';

const calloutMeta: Record<
  CalloutVariant,
  { variant: 'info' | 'warning' | 'success'; Icon: typeof Info }
> = {
  info: { variant: 'info', Icon: Info },
  warning: { variant: 'warning', Icon: TriangleAlert },
  success: { variant: 'success', Icon: CircleCheck },
};

function Block({ block }: { block: DocBlock }): React.JSX.Element {
  switch (block.type) {
    case 'p':
      return <Md>{block.md}</Md>;

    case 'code':
      return (
        <figure className="my-4">
          <CodeBlock code={block.code} language={block.language} />
          {block.caption && (
            <figcaption className="mt-1.5 text-xs text-muted-foreground">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'tabs':
      return (
        <Tabs defaultValue={block.tabs[0]?.label} className="my-4">
          <TabsList>
            {block.tabs.map((t) => (
              <TabsTrigger key={t.label} value={t.label}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {block.tabs.map((t) => (
            <TabsContent key={t.label} value={t.label}>
              <CodeBlock code={t.code} language={t.language} />
              {t.caption && <p className="mt-1.5 text-xs text-muted-foreground">{t.caption}</p>}
            </TabsContent>
          ))}
        </Tabs>
      );

    case 'clienttabs':
      return (
        <Tabs defaultValue={block.tabs[0]?.label} className="my-4">
          <TabsList>
            {block.tabs.map((t) => (
              <TabsTrigger key={t.label} value={t.label}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {block.tabs.map((t) => (
            <TabsContent key={t.label} value={t.label}>
              <Md>{t.md}</Md>
            </TabsContent>
          ))}
        </Tabs>
      );

    case 'callout': {
      const { variant, Icon } = calloutMeta[block.variant];
      return (
        <Alert variant={variant} icon={<Icon />} className="my-4">
          {block.title && <p className="mb-1 font-medium">{block.title}</p>}
          <Md className="[&_p]:my-0">{block.md}</Md>
        </Alert>
      );
    }

    case 'steps':
      return (
        <ol className="my-4 space-y-4">
          {block.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{s.title}</p>
                {s.body && <Md className="mt-0.5">{s.body}</Md>}
                {s.code && (
                  <div className="mt-2">
                    <CodeBlock code={s.code} language={s.language} />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      );
  }
}

export function DocArticle({ doc }: { doc: DocPage }): React.JSX.Element {
  return (
    <article className="min-w-0">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{doc.title}</h1>
        <p className="mt-2 text-base text-muted-foreground">{doc.lede}</p>
      </header>
      {doc.sections.map((section) => (
        <section key={section.id} id={section.id} className="mb-10 scroll-mt-20">
          <h2 className="mb-3 text-xl font-semibold tracking-tight text-foreground">
            {section.title}
          </h2>
          {section.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </section>
      ))}
    </article>
  );
}

import { DocArticle } from './doc-article';
import type { DocPage } from '../types';

// The article column. Width is constrained by the layout's max-w-5xl shell
// (matching agentage.io/docs); the sidebar takes the left rail.
export function DocPageView({ doc }: { doc: DocPage }): React.JSX.Element {
  return <DocArticle doc={doc} />;
}

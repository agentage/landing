import { NextResponse, type NextRequest } from 'next/server';
import { apexDocsRedirectPath, docsHostAction, docsHostRouting } from '@/docs/host-routing';
import { docSlugs } from '@/docs/registry';

// SITE_FQDN is the runtime signal; NEXT_PUBLIC_SITE_FQDN is the build-baked sentinel
// that docker/runtime-env.sh rewrites, so the split works either way.
const siteFqdn = (): string | undefined =>
  process.env.SITE_FQDN || process.env.NEXT_PUBLIC_SITE_FQDN;

export function middleware(req: NextRequest): NextResponse {
  const routing = docsHostRouting(siteFqdn());
  // No split configured (local dev, unconfigured container) or an unknown Host:
  // serve exactly as before - the deploy e2e gate curls the image on localhost.
  if (!routing) return NextResponse.next();

  const host = (req.headers.get('host') ?? '').toLowerCase().split(':')[0];
  const { pathname, search } = req.nextUrl;

  if (host === routing.docsHost) {
    const action = docsHostAction(pathname, docSlugs());
    // Not a doc: it is an apex page (the shared header/footer link to those).
    if (action.kind === 'apex') {
      return NextResponse.redirect(`https://${routing.apexHost}${action.pathname}${search}`, 308);
    }
    if (action.kind === 'serve') return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = action.pathname;
    return NextResponse.rewrite(url);
  }

  if (host === routing.apexHost || host === `www.${routing.apexHost}`) {
    const target = apexDocsRedirectPath(pathname);
    if (!target) return NextResponse.next();
    return NextResponse.redirect(`https://${routing.docsHost}${target}${search}`, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/).*)'],
};

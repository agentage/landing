import { NextResponse, type NextRequest } from 'next/server';
import {
  apexDocsRedirectPath,
  docsHostAction,
  docsHostRouting,
  shortLinkDocSlug,
} from '@/docs/host-routing';
import { docSlugs } from '@/docs/registry';

// SITE_FQDN is the runtime signal; NEXT_PUBLIC_SITE_FQDN is the build-baked sentinel
// that docker/runtime-env.sh rewrites, so the split works either way.
const siteFqdn = (): string | undefined =>
  process.env.SITE_FQDN || process.env.NEXT_PUBLIC_SITE_FQDN;

export function middleware(req: NextRequest): NextResponse {
  const routing = docsHostRouting(siteFqdn());
  const host = (req.headers.get('host') ?? '').toLowerCase().split(':')[0];
  const { pathname, search } = req.nextUrl;

  // The docs host owns its own paths first, so a short link that is also a doc
  // slug (/connect) serves directly there instead of taking a redirect hop.
  if (routing && host === routing.docsHost) {
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

  // Advertised short link: one hop to the docs host from the apex, same-host
  // otherwise (local dev / unknown Host keep the old /docs/<slug> behavior).
  const shortLink = shortLinkDocSlug(pathname);
  if (shortLink) {
    const onApex = routing && (host === routing.apexHost || host === `www.${routing.apexHost}`);
    const target = onApex
      ? `https://${routing.docsHost}/${shortLink}${search}`
      : `/docs/${shortLink}${search}`;
    return NextResponse.redirect(new URL(target, req.url), 308);
  }

  // No split configured (local dev, unconfigured container) or an unknown Host:
  // serve exactly as before - the deploy e2e gate curls the image on localhost.
  if (!routing) return NextResponse.next();

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

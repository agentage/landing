# CLAUDE.md

Guidance for working in this repository - the Agentage Memory landing site.

## Layout

npm-workspaces monorepo, 2 packages:

| Package             | Role                              | Port |
| ------------------- | --------------------------------- | ---- |
| `@agentage/shared`  | site-origin + environment helpers | -    |
| `@agentage/landing` | Next.js marketing site            | 3000 |

The design system lives in its own repo (`agentage/design-system`) and is consumed from npm as `@agentage/design-system` - the site imports its OKLCH token CSS (`@agentage/design-system/theme.css`), not its JS.

## Dev

`npm install`, then `npm run dev` (site on :3000). `dev` builds `shared` first - the site consumes it as built output. Re-run `dev` after editing `shared`.

## Testing

- Unit: Vitest (`npm run test`, in `verify`).
- E2E: Playwright. `npm run test:e2e` auto-starts its own server. Landing tests are tagged `@smoke` / `@p0` (SEO/PWA) / `@full` (content/a11y); `test:e2e:smoke` runs the smoke tier. Set `LANDING_BASE_URL` to point at a deployed site (host-aware assertions branch local/dev vs prod).
- CI: `.github/workflows/ci.yml` runs `verify` + the landing e2e suite on PR and push to `master`.

## Stack

Node 22+, TypeScript (strict, ESM), Next.js App Router, Tailwind CSS v4, React 19. Prettier (single quotes, 100 cols) + ESLint. Vitest for unit tests.

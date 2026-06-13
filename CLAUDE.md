# CLAUDE.md

Guidance for working in this repository — the Agentage Memory landing site + design system.

## Layout

npm-workspaces monorepo, 4 packages:

| Package                   | Role                              | Port |
| ------------------------- | --------------------------------- | ---- |
| `@agentage/shared`        | site-origin + environment helpers | —    |
| `@agentage/design-system` | OKLCH tokens + React components   | —    |
| `@agentage/landing`       | Next.js marketing site            | 3000 |
| `@agentage/showcase`      | design-system playground          | 3011 |

## Dev

`npm install`, then `npm run dev` (site on :3000) or `npm run dev:showcase` (:3011). Both build `shared` + `design-system` first — the site consumes the design system's CSS tokens and `shared` as built output. Re-run the `dev` script after editing either lib.

## Testing

- Unit: Vitest (`npm run test`, in `verify`).
- E2E: Playwright. `npm run test:e2e` (landing) + `npm run test:e2e:showcase` - each auto-starts its own server. Landing tests are tagged `@smoke` / `@p0` (SEO/PWA) / `@full` (content/a11y); `test:e2e:smoke` runs the smoke tier. Set `LANDING_BASE_URL` to point at a deployed site (host-aware assertions branch local/dev vs prod).
- CI: `.github/workflows/ci.yml` runs `verify` + both e2e suites on PR and push to `master`.

## Stack

Node 22+, TypeScript (strict, ESM), Next.js App Router, Tailwind CSS v4, React 19. Prettier (single quotes, 100 cols) + ESLint. Vitest for unit tests.

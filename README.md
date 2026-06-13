# Agentage Memory — landing site

The public marketing site for **Agentage Memory** ("one memory, every AI"), plus the design
system it's built on. The product itself lives at **[agentage.io](https://agentage.io)**; this
repository is just the website.

## What's in here

```
packages/
├── shared/          # @agentage/shared — site-origin + environment helpers
├── design-system/   # @agentage/design-system — OKLCH design tokens + React components
├── landing/         # @agentage/landing — the Next.js marketing site (port 3000)
└── showcase/        # @agentage/showcase — design-system playground (port 3011)
```

## Prerequisites

- **Node.js 22+** and **npm 10+** (see `engines` in `package.json`)

## Quick start

```bash
npm install         # install all workspaces
npm run dev         # build the libs, then serve the site at http://localhost:3000
```

To explore the design system on its own:

```bash
npm run dev:showcase  # http://localhost:3011
```

`shared` and `design-system` are built before the apps run (the `dev` scripts handle this). After
editing either, re-run the `dev` script to pick up the changes.

## Scripts

| Script                      | What it does                                         |
| --------------------------- | ---------------------------------------------------- |
| `npm run dev`               | Build libs + run the site (`:3000`)                  |
| `npm run dev:showcase`      | Build libs + run the playground (`:3011`)            |
| `npm run build`             | Production build of libs + site + playground         |
| `npm run type-check`        | `tsc` across all workspaces                          |
| `npm run lint`              | ESLint                                               |
| `npm run format`            | Prettier `--write`                                   |
| `npm run verify`            | Full gate: type-check + lint + format + test + build |
| `npm run test:e2e`          | Playwright e2e against the site (auto-starts it)     |
| `npm run test:e2e:showcase` | Playwright e2e against the playground                |

## Testing

- **Unit** (`npm run test`, part of `verify`): Vitest, fast.
- **E2E** (`npm run test:e2e`): Playwright. Each suite auto-builds the libs and starts its own
  server (no need to run `dev` first). Landing tests are tiered with tags - run a subset with
  `npm run test:e2e:smoke` (`@smoke`), or the full set (`@smoke` + `@p0` SEO/PWA + `@full`
  content/a11y) by default. Point at a deployed site with `LANDING_BASE_URL=https://... npm run test:e2e`.

CI (`.github/workflows/ci.yml`) runs `verify` and both e2e suites on every PR and push to `master`.

## Configuration

All environment variables are optional for local development. To customise, copy the example and
edit it:

```bash
cp packages/landing/.env.example packages/landing/.env
```

It covers the public site URL, optional analytics, and the search-console verification token.

## Contributing

1. Fork / branch, make your change.
2. Run **`npm run verify`** — it must pass before a PR (this is the merge gate).
3. Open a pull request describing the change.

## License

© Agentage. All rights reserved. This repository is published for transparency; the Agentage name,
logo, and site copy are not licensed for reuse.

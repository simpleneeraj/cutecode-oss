<div align="center">
  <img src="public/og-image.png" alt="Cool Snippets" width="100%" />
  <h1>Cool Snippets</h1>
  <p><strong>Beautiful, animated images and videos of your code.</strong></p>
  <a href="https://coolsnippets.fun"><strong>coolsnippets.fun</strong></a>
</div>

## Features

- **70 presets** in 9 groups: Seasonal, Brands, Lofi, Night, Cozy, Romantic, Vintage, Retro and Classic. Most are animated scenes with dark and light modes.
- **Sample code per preset.** Untouched code swaps to the preset's own snippet, language and file name.
- **Export** to PNG, SVG, clipboard, MP4 and GIF, including multi-slide reels.
- **Slides** for step-by-step code stories.
- **Sharing**: publish snippets with public, private or passcode links, then remix them.
- **Syntax highlighting** with Shiki for 100+ languages.
- **Plans**: Free, Pro and Premium, billed through Dodo Payments.

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| UI | Tailwind CSS 4, Base UI (coss), Hugeicons |
| Animation | Motion |
| State | Jotai |
| Highlighting | Shiki |
| Auth | Better Auth (email, GitHub, Google) |
| Database | PostgreSQL with Drizzle ORM |
| Payments | Dodo Payments |
| Hosting | AWS Amplify, RDS, SES, EventBridge, CloudWatch RUM ([runbook](docs/deploy-aws.md)) |

## Getting started

Requirements: Node.js 22 or later, Yarn and PostgreSQL.

```bash
git clone git@github.com:simpleneeraj/cool-snippets.git
cd cool-snippets
yarn install
```

Create `.env.development`:

```env
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

BETTER_AUTH_SECRET="openssl rand -hex 32"
BETTER_AUTH_URL="http://localhost:3000"
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

DATABASE_URL="postgresql://user:password@localhost:5432/cool_snippets"

DODO_PAYMENTS_API_KEY=""
DODO_PAYMENTS_WEBHOOK_KEY=""
DODO_PAYMENTS_ENVIRONMENT="test_mode"
NEXT_PUBLIC_DODO_PRODUCT_PRO_MONTHLY=""
NEXT_PUBLIC_DODO_PRODUCT_PRO_YEARLY=""
NEXT_PUBLIC_DODO_PRODUCT_PREMIUM_MONTHLY=""
NEXT_PUBLIC_DODO_PRODUCT_PREMIUM_YEARLY=""
NEXT_PUBLIC_DODO_PRODUCT_PREMIUM=""

CRON_SECRET="openssl rand -hex 32"
```

- OAuth providers turn on when their client id and secret are set. Redirect URLs: `<url>/api/auth/callback/github` and `<url>/api/auth/callback/google`.
- `yarn dodo:products` creates the Dodo subscription products and prints their env lines.
- Production also uses `SES_FROM_EMAIL`, `AWS_REGION`, `SSM_SECRETS_PATH` and the `NEXT_PUBLIC_RUM_*` variables. See [docs/deploy-aws.md](docs/deploy-aws.md).

Set up the database and start the app:

```bash
yarn db:push
yarn dev
```

## Scripts

| Script | What it does |
|---|---|
| `yarn dev` | Start the dev server |
| `yarn lint` / `yarn type-check` | ESLint and TypeScript checks |
| `yarn test` / `yarn test:api` | Unit tests and API tests (Vitest) |
| `yarn db:generate` / `db:migrate` / `db:studio` | Drizzle migrations and studio |
| `yarn dodo:products` | Create or update Dodo products |

## Project structure

```
src/
  app/            routes: editor, dashboard, pricing, legal, api
  components/
    editor/       editor UI, export, controls
    presets/      one folder per preset (theme.ts, scene, styles)
  db/             Drizzle schema
  lib/            billing, capture, encoders, secrets
  server/         API routers
  store/          Jotai atoms
drizzle/          SQL migrations
infra/            AWS CDK
docs/             deploy runbook, launch plan
```

## Adding a preset

1. Create `src/components/presets/<id>/` with `theme.ts`, a frame `index.tsx` and a CSS module.
2. Add a `sample` to the theme so the preset ships its own code.
3. Register it in `src/components/presets/themes/index.ts`, and in `scene/scene-themes.ts` if it is an animated scene.

## Credits

Cool Snippets started from [ray.so](https://ray.so) by [Raycast](https://raycast.com), used under the MIT License. Fonts, libraries and icons are credited at [/legal/credits](https://coolsnippets.fun/legal/credits) and in [CREDITS.md](CREDITS.md).

## License

Private repository. See [LICENSE](LICENSE) for the Raycast MIT notice that covers the original ray.so code.

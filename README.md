<div align="center">
  <img src="public/og-image.png" alt="Cool Snippets" width="100%" />
  <h1>Cool Snippets</h1>
  <p><strong>Create beautiful images of your code</strong></p>
  <p>Open-source ray.so alternative with 45+ themes, snippet sharing, and more.<br/>Small Tools – Big Impact ✨</p>

  <a href="https://github.com/simpleneeraj/cutecode/stargazers"><img src="https://img.shields.io/github/stars/simpleneeraj/cutecode?style=for-the-badge&logo=github&logoColor=white&color=0d1117" alt="Stars" /></a>
  <a href="https://github.com/simpleneeraj/cutecode/blob/main/LICENSE"><img src="https://img.shields.io/github/license/simpleneeraj/cutecode?style=for-the-badge&color=0d1117" alt="License" /></a>
  <a href="https://github.com/simpleneeraj/cutecode/issues"><img src="https://img.shields.io/github/issues/simpleneeraj/cutecode?style=for-the-badge&color=0d1117" alt="Issues" /></a>
  <a href="https://github.com/sponsors/simpleneeraj"><img src="https://img.shields.io/badge/Sponsor-❤️-0d1117?style=for-the-badge" alt="Sponsor" /></a>
  <br />
  <a href="https://coolsnippets.fun"><strong>Live Demo →</strong></a> · <a href="#-getting-started">Quick Start</a> · <a href="#-contributing">Contribute</a> · <a href="https://github.com/simpleneeraj/cutecode/issues">Report Bug</a>
</div>

<br />

## ✨ Features

- 🎨 **45+ Beautiful Themes** — Brand themes (Vercel, Stripe, Supabase, OpenAI, Claude, Gemini, etc.) + aesthetic themes (Aurora Nights, Neon Dreams, Golden Hour, etc.)
- 🖼️ **Code Screenshot Generator** — Turn code into stunning shareable images in seconds
- 📝 **Snippet Sharing** — Save, share, and explore public code snippets with unique URLs
- 🔄 **Remix** — Fork and remix any shared snippet with your own customizations
- 🌓 **Dark & Light Mode** — Full theme support with system preference detection
- 🎯 **Syntax Highlighting** — Powered by Shiki with 100+ language support
- 📤 **Export Options** — Copy to clipboard, download as PNG, or share via URL
- 🔐 **Authentication** — Better Auth (email + GitHub/Google OAuth) to save and manage your snippets
- 💎 **Pro & Premium Plans** — Pro ($5/mo or $48/yr): premium themes and fonts, 3x export, no watermark, unlimited publishing. Premium ($12/mo or $120/yr): adds 6x export, HD video, private and passcode shares, full analytics
- 📱 **Responsive Design** — Works beautifully on desktop and mobile
- ⚡ **Built on Next.js 16** — React 19, App Router, Server Components, Edge-ready

## 🎨 Themes (45+)

Cool Snippets ships with 45+ hand-crafted themes across two categories:

| Brand Themes (16) | Aesthetic Themes (28+) |
|---|---|
| Vercel | Bitmap |
| Supabase | Noir |
| Tailwind | Ice |
| OpenAI | Sand |
| Mintlify | Forest |
| Prisma | Mono |
| Clerk | Breeze |
| ElevenLabs | Candy |
| Resend | Crimson |
| Trigger.dev | Falcon |
| Nuxt | Meadow |
| Browserbase | Midnight |
| Cloudflare | Raindrop |
| Gemini | Sunset |
| Stripe | Roses |
| Claude | Retro Mac |
| | Love |
| | Valentine |
| | Coffee Date |
| | Sunset Chill |
| | PS6 |
| | Aurora Nights |
| | Starry Night |
| | Strawberry Milk |
| | Frosted Glass |
| | Velvet Night |
| | Peachy Mood |
| | Neon Dreams |
| | Golden Hour |
| | Rabbit |

> **Want to add a theme?** Check the [Contributing](#-contributing) section below!

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **UI** | React 19, Tailwind CSS 4, Base UI (coss) |
| **Animation** | Motion (Framer Motion) |
| **Syntax Highlighting** | Shiki |
| **Authentication** | Better Auth |
| **Database** | PostgreSQL + Drizzle ORM |
| **Payments** | Dodo Payments |
| **State Management** | Jotai |
| **Deployment** | AWS Amplify Hosting ([runbook](docs/deploy-aws.md)) |

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ (Next.js 16 requirement)
- **PostgreSQL** database
- **Yarn** (package manager)

### 1. Clone the repository

```bash
git clone https://github.com/simpleneeraj/cutecode.git
cd cutecode
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Set up environment variables

Create `.env.development` and fill in your environment variables:

```env
# App
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Better Auth
BETTER_AUTH_SECRET="generate-with-openssl-rand-hex-32"
BETTER_AUTH_URL="http://localhost:3000"
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Dodo Payments (https://dodopayments.com)
DODO_PAYMENTS_API_KEY="your_api_key"
DODO_PAYMENTS_WEBHOOK_KEY="whsec_..."
DODO_PAYMENTS_RETURN_URL="http://localhost:3000/checkout/success"
DODO_PAYMENTS_ENVIRONMENT="test_mode"
NEXT_PUBLIC_DODO_PRODUCT_PRO_MONTHLY="pdt_..."
NEXT_PUBLIC_DODO_PRODUCT_PRO_YEARLY="pdt_..."
NEXT_PUBLIC_DODO_PRODUCT_PREMIUM_MONTHLY="pdt_..."
NEXT_PUBLIC_DODO_PRODUCT_PREMIUM_YEARLY="pdt_..."
NEXT_PUBLIC_DODO_PRODUCT_PREMIUM="pdt_..."   # legacy Premium, grandfathered

# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/cutecode"

# Cron Security
CRON_SECRET="generate-with-openssl-rand-hex-32"
```

> **Auth setup:** OAuth providers are enabled when their client id and secret are set.
> Use `<your-url>/api/auth/callback/github` and `<your-url>/api/auth/callback/google` as redirect URLs.
>
> **Products:** `yarn dodo:products` creates or updates the four Dodo subscription products
> and prints the product env lines.

### 4. Set up the database

```bash
yarn db:generate
yarn db:push
```

### 5. Run the development server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) — you're all set! 🎉

## 📁 Project Structure

```
cutecode/
├── prisma/              # Database schema & migrations
├── public/              # Static assets, backgrounds, icons
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── (navigation)/ # Main app routes (editor, explore, snippets)
│   │   ├── api/         # API routes (tRPC, webhooks)
│   │   ├── account/     # Auth pages (sign-in, sign-up)
│   │   ├── pricing/     # Pricing page
│   │   └── legal/       # Terms, privacy, refund
│   ├── components/      # Reusable UI components
│   │   └── presets/     # 45+ theme preset frames
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   ├── server/          # Server-side logic (tRPC routers)
│   ├── store/           # Jotai state atoms
│   ├── styles/          # Global CSS & preset styles
│   └── utils/           # Helper functions
├── .env.development     # Environment variables
├── next.config.js       # Next.js configuration
└── package.json
```

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Adding a New Theme

1. Create a new directory in `src/components/presets/your-theme-name/`
2. Add your theme configuration and frame component
3. Register it in `src/components/presets/themes/index.ts`
4. Submit a PR!

> We love new themes — brand themes, aesthetic themes, seasonal themes, you name it!

## 💖 Sponsor

If Cool Snippets helps you create beautiful code screenshots, consider sponsoring to keep the project alive and growing:

<a href="https://github.com/sponsors/simpleneeraj">
  <img src="https://img.shields.io/badge/Sponsor_Cool_Snippets-❤️-ea4aaa?style=for-the-badge&logo=github-sponsors" alt="Sponsor" />
</a>

## 🙏 Acknowledgements

- **Special thanks to [Raycast](https://raycast.com) and [ray.so](https://ray.so)** — Cool Snippets started as a fork of the incredible ray.so project. We're grateful for the foundation they built and their commitment to open source.
- [Shiki](https://shiki.matsu.io/) — Beautiful syntax highlighting
- [Better Auth](https://better-auth.com) — Authentication
- [AWS](https://aws.amazon.com) — Hosting (Amplify), database (RDS), email (SES), monitoring (CloudWatch RUM)

See [CREDITS.md](CREDITS.md) for the full list of technologies, libraries, and inspirations.

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p><strong>Small Tools – Big Impact ✨</strong></p>
  <p>Built with ❤️ by <a href="https://github.com/simpleneeraj">simpleneeraj</a></p>
  <p>
    <a href="https://coolsnippets.fun">Website</a> · 
    <a href="https://x.com/iamsimpleneeraj">Twitter</a> · 
    <a href="https://github.com/simpleneeraj/cutecode/issues">Issues</a>
  </p>
</div>

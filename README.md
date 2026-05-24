<div align="center">
<a href="https://invitely-gg.vercel.app">
  <img
    alt="Invitely.gg | Send Invitations at Scale, On Your Behalf."
    src="https://github.com/Vinodbiradar09/Invitely.gg/blob/main/public/invitely.gg-banner.png?raw=true"
  >
</a>
<h3>Invitely.gg</h3>
<p>
  Send Invitations at Scale, On Your Behalf.
  <br />
  <a href="https://invitely-gg.vercel.app"><strong>Learn more »</strong></a>
  <br />
  <br />
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#getting-started"><strong>Getting Started</strong></a> ·
  <a href="#contributing"><strong>Contributing</strong></a>
</p>
<p>
  <a href="https://github.com/Vinodbiradar09/Invitely.gg/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/Vinodbiradar09/Invitely.gg?label=license&logo=github&color=f80&logoColor=fff" alt="License" />
  </a>
  <a href="https://github.com/Vinodbiradar09/Invitely.gg/stargazers">
    <img src="https://img.shields.io/github/stars/Vinodbiradar09/Invitely.gg?style=flat&logo=github&color=f80&logoColor=fff" alt="Stars" />
  </a>
</p>
</div>

<br/>

## Introduction

Invitely.gg is a server-first platform that handles invitation delivery at scale so you don't have to. Give us your list and we handle the rest: professional emails sent on your behalf, automatically, without the manual back-and-forth.

Built with a strong emphasis on type safety, minimal client-side overhead, and predictable performance.

## Deploy your own

One-click deploy to Vercel — you'll be prompted to set the environment variables listed in [`.env.example`](./.env.example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FVinodbiradar09%2FInvitely.gg&env=BETTER_AUTH_SECRET,BETTER_AUTH_URL,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,DATABASE_URL,RESEND_API_KEY,FROM,NEXT_PUBLIC_APP_URL,APP_URL,CRON_SECRET&envDescription=Required%20to%20run%20Invitely.gg.%20See%20the%20.env.example%20file%20for%20what%20each%20one%20does.&envLink=https%3A%2F%2Fgithub.com%2FVinodbiradar09%2FInvitely.gg%2Fblob%2Fmain%2F.env.example&project-name=invitely-gg&repository-name=invitely-gg)

## Tech Stack

- [Next.js](https://nextjs.org/) – framework
- [React](https://react.dev/) – UI
- [TypeScript](https://www.typescriptlang.org/) – language
- [Tailwind CSS](https://tailwindcss.com/) – styling
- [shadcn/ui](https://ui.shadcn.com/) – component library
- [Radix UI](https://www.radix-ui.com/) – headless primitives
- [Motion](https://motion.dev/) – animations
- [Sonner](https://sonner.emilkowal.ski/) – toast notifications
- [PostgreSQL](https://www.postgresql.org/) – database
- [Prisma](https://www.prisma.io/) – ORM
- [Better Auth](https://better-auth.com/) – authentication
- [Resend](https://resend.com/) – email delivery
- [React Email](https://react.email/) – email templates
- [Zod](https://zod.dev/) – validation
- [Vercel](https://vercel.com/) – deployments

## Getting Started

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) 10+ (the project pins `packageManager` in `package.json`)
- PostgreSQL running locally or remotely

### 1. Clone the repository

```bash
git clone https://github.com/Vinodbiradar09/Invitely.gg.git
cd Invitely.gg
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in real values:

```bash
cp .env.example .env
```

Key variables you'll need:

```env
# Auth
BETTER_AUTH_SECRET=your_long_random_secret
BETTER_AUTH_URL=http://localhost:3000

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Database
DATABASE_URL=postgresql://user:password@localhost:5433/invitely?schema=public

# Email
RESEND_API_KEY=re_your_api_key
FROM="Invitely.gg <noreply@invitely.gg>"

# AI (optional)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_URL=http://localhost:3000

# Cron security
CRON_SECRET=your_cron_secret_uuid
```

### 4. Set up the database

```bash
pnpm exec prisma migrate dev
```

### 5. Start the development server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

## Architecture

- **Server-first** — Client components are opt-in, not the norm.
- **Type-safe end to end** — Database → API → UI.
- **Minimal abstractions** — No magic, no hidden state.
- **Predictable performance** — Every query and render is intentional.

## Contributing

We love contributions! Here's how you can contribute:

- [Open an issue](https://github.com/Vinodbiradar09/Invitely.gg/issues) if you've encountered a bug.
- Follow the [contributing guide](./CONTRIBUTING.md) to set up your local dev environment.
- Make a [pull request](https://github.com/Vinodbiradar09/Invitely.gg/pulls) to add features or fix bugs.

## Security

See [SECURITY.md](./SECURITY.md) for our responsible disclosure policy.

## Code of Conduct

This project follows the [Contributor Covenant](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Support

Need help? See [SUPPORT.md](./SUPPORT.md) — short version: questions go in [Discussions](https://github.com/Vinodbiradar09/Invitely.gg/discussions), bugs go in [Issues](https://github.com/Vinodbiradar09/Invitely.gg/issues), security goes to **security@invitely.gg**.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for what shipped in each release.

## License

[MIT](./LICENSE)

# Changelog

All notable changes to Invitely.gg will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> Anything before `1.0.0` is considered pre-release. Public APIs, schemas,
> and routes may change between minor versions.
>
> The project went live in March 2026; this changelog starts at the v0.2 line
> when we adopted formal versioning. Earlier history lives in the [v0.1 section](#011--march--april-2026)
> for context.

## [Unreleased]

## [0.2.0] — 2026-05-24

The "v2" cut: poll-based scheduling, calendar surface, analytics dashboards,
a refreshed monochrome theme across every page, and a hardened OSS toolchain.

### Added — product

- **Polls** — create date polls with multiple time-slot options, public token-based voting, and AI-assisted "best slot" recommendation. Lock in the winning slot to auto-create an event and send the real invitations.
- **Calendar** — month and agenda views, "hide cancelled" toggle, and a subscribable `.ics` feed (with regenerate-token support) for Google / Apple / Outlook.
- **Analytics** — lifetime KPIs, conversion funnel, response-rate trend (recharts), best-send-time chart, top-engaged guests, ghosters list, recurring-series sparklines, and AI-generated summary.
- **Templates page** — list / create / delete reusable email templates per user (max 20).
- **Theme** — strict monochrome dark theme, frosted-glass mobile sidebar, white/X surface tokens, `cursor-pointer` on every interactive element.

### Added — developer / OSS hygiene

- **CI workflow** running ESLint + `tsc --noEmit` + `next build` on every PR; separate Playwright job runs smoke tests against a production build.
- **Conventional Commits** enforced via `commitlint` + Husky `commit-msg` hook.
- **Dependabot** — weekly grouped npm updates and monthly GitHub Actions updates.
- **Sentry scaffolding** — `instrumentation.ts` (server) and `instrumentation-client.ts` (browser); both gated on env vars so the project still builds without a Sentry account.
- **`robots.ts` + `sitemap.ts`** metadata routes, Deploy-to-Vercel button in the README, `vercel.json` locking pnpm in code.
- **Issue and PR templates**, `CODE_OF_CONDUCT.md`, `SUPPORT.md`, `.env.example`.
- **`proxy.ts`** now protects all dashboard routes (`/calendar`, `/polls`, `/analytics`, `/templates`) at the edge.
- Removed `next.config` `ignoreBuildErrors` — type errors now block production builds.

### Changed

- Migrated all dashboard surfaces from hardcoded `bg-[#0a0a0a]` etc. to the shared `bg-white/2` token system; lifted the page background base from `#080808` to `#101010` for visible depth.
- Replaced the green / sky-400 success accent with a pure-monochrome `border-white/25 bg-white/10 text-foreground` treatment.
- Sidebar / mobile chrome lifted to `#161616` for a clearer 3-tier elevation stack (page → scrim → sidebar).

### Removed

- `package-lock.json` (we standardise on pnpm; the lockfile is `pnpm-lock.yaml`).

## [0.1.x] — March – April 2026

Initial product builds, never formally tagged. Captured here for context.

### Foundation (March)

- Email + Google OAuth via Better Auth, session middleware.
- Workspaces (up to 5 × 25 members), per-user invitation limits.
- Events: create, edit, cancel, delete; one-off and recurring (daily/weekly/monthly) with per-occurrence sending.
- Send-invitations multi-step flow with workspace recipient picker.
- AI features (Gemini): invite rewriting, smart send time, event insights.
- Templates (save / reuse email subject + body).
- RSVP token pages (attending / maybe / declined) + tracking pixel for opens.
- Scheduled sends via hourly GitHub Actions cron.

### Brand and surface (March – April)

- Landing-page overhaul with hero, AI section, animated brand footer, scanned-image reveal.
- Open Graph + Twitter card metadata, dynamic OG image generation.
- Email preview, workspace preview, paper-plane logo, real product screenshots in the marketing pages.

[Unreleased]: https://github.com/Vinodbiradar09/Invitely.gg/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/Vinodbiradar09/Invitely.gg/releases/tag/v0.2.0

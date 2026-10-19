# WAJIBU web app

The WAJIBU ESG advisory site (formerly a static HTML site), rebuilt on
**Next.js 15 (App Router) + React 19 + TypeScript**. Visual design, copy, layout and
behaviour are unchanged: every page keeps its original markup, class names and CSS.

## Requirements

- Node.js 20 or newer

## Run locally

```bash
npm install
cp .env.example .env.local   # optional – defaults work without it
npm run dev                  # http://localhost:3000
```

## Charity portal

The site includes a private charity–company portal (`/login`, `/portal`, `/admin`). It needs a database and a
few environment variables before it works – see **[docs/PORTAL.md](docs/PORTAL.md)** for the decisions it implements,
local setup (`npx prisma migrate dev`, `npm run db:seed`), security notes and the go-live checklist.

## Build

```bash
npm run build
npm run start                # serves the production build on :3000
npm run typecheck
```

## Project structure

```
src/
  app/
    layout.tsx               root layout (html/body, fonts preconnect, base metadata)
    page.tsx + HomePage.tsx  one folder per route: page.tsx (metadata) + <Name>Page.tsx (markup)
    about/ services/ insights/ impact/ contact/ privacy/ terms/
    not-found.tsx            the old 404.html
    robots.ts, sitemap.ts    replace robots.txt / sitemap.xml
    api/chat/route.ts        placeholder for AI / LLM features (Vercel AI SDK)
  components/
    LegacyScripts.tsx        runs each page's original JS (counters, carousel, burger menu…)
    legacy/                  markup blocks shared by several pages (navbar, footer, cookie banner…)
  lib/
    site.ts                  SITE_URL
    legacy-handlers.ts       React versions of the old inline onerror/onsubmit handlers
    ai/                      reserved for prompts/tools/provider setup
public/
  global.css                 the original global.css, served as-is
  images/                    original images (+ images/embedded: the base64 images, extracted)
legacy/                      untouched copy of the old static site (git-ignored; safe to delete)
tools/convert.mjs            the one-off converter that produced src/app from legacy/
```

Notes on fidelity:

- Each page's inline `<style>` blocks sit in the same order relative to `global.css` as
  before, so the cascade is identical. Per-page Google Fonts links are preserved
  (weights differ between pages).
- The original page scripts run unchanged inside `LegacyScripts`; listeners, timers and
  observers are cleaned up on navigation, so client-side routing is safe.
- The navbar/footer differ slightly from page to page in the original, so they are kept as
  page-specific markup where they differ and as shared components in
  `src/components/legacy/` where they were identical. Active-link highlighting is now
  computed from the current route.
- Old URLs (`/about.html`, `/index.html`, …) 301-redirect to the clean routes
  (`next.config.ts`).

## Environment variables

See `.env.example`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, `sitemap.xml`, `robots.txt` |
| `ANTHROPIC_API_KEY`, `AI_MODEL` | Reserved for the AI chat route (unused for now) |

## Deploy

### Vercel

```bash
npm i -g vercel
vercel          # first deploy / link the project
vercel --prod
```

Or import the repo at vercel.com/new – the Next.js preset is detected automatically
Add the variables from `.env.example` in
*Project → Settings → Environment Variables*.

### Netlify

```bash
npm i -g netlify-cli
netlify login
netlify init            # or: netlify link
netlify deploy --build --prod
```

Or connect the repo in the Netlify dashboard (build command `npm run build`; Netlify detects Next.js
and installs its official runtime automatically). Headers and redirects are defined in
`next.config.ts`, so no `_redirects` file or `netlify.toml` is needed.

## Adding AI features later

`src/app/api/chat/route.ts` is a documented stub returning `501`. Install the Vercel AI SDK
(`npm i ai @ai-sdk/anthropic`), set `ANTHROPIC_API_KEY`, and follow the comments in that file.

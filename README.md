# Nomad Investments Limited

Marketing site for Nomad Investments Limited — a Ugandan consulting company operating
across ICT and cybersecurity, engineering and infrastructure, agriculture, energy,
environment, labour and business consulting. Founded 2016, Kampala.

## Stack

- **Next.js 15** (App Router) + React 19, TypeScript
- **Tailwind CSS v4** with design tokens in `src/app/globals.css`
- **GSAP / ScrollTrigger** for scroll-driven reveals
- **Lenis** for smooth scrolling (exposed on `window.__lenis` so nav jumps route through it
  rather than fighting its rAF loop)

## Running locally

```bash
npm install
npm run dev
```

The site runs at http://localhost:3000. `npm run build` produces the production build.

## Structure

| Path | What it is |
| --- | --- |
| `src/app/layout.tsx` | Fonts, metadata, and the persistent `SmoothScroll` + `Nav` |
| `src/app/page.tsx` | Section order for the single-page site |
| `src/app/globals.css` | Design tokens, type scale, nav and button styles |
| `src/components/` | One file per section, plus `Nav` and `Preloader` |
| `public/media/` | Video and image assets referenced by `/media/...` paths |

Sections are separated by `<Transition>`, which blends one section's background into the
next. Sections flag their background brightness with `data-nav-theme="light"`; the nav
samples what is painted beneath it and recolours itself to match.

`ServiceScroll` is 620vh of pinned scroll-scrubbed video — its five chapters are scroll
offsets rather than anchors, which is why the nav dropdown converts a chapter's progress
back into a scroll position instead of using an `href`.

## Deploying

Deploys to Vercel as a standard Next.js app — no environment variables required. Import
the repository and accept the detected framework preset.

Note that `next.config.ts` pins `outputFileTracingRoot` to this directory, since the parent
folder carries its own lockfile for unrelated tooling.

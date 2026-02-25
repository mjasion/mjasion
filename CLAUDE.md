# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website/blog built with **Astro 5** + **Tailwind CSS v4**. Blog as the landing page with a bento grid layout, full portfolio about page. Static site deployed to Cloudflare Pages. Site: [mjasion.pl](https://mjasion.pl)

## Commands

```bash
# Dev server
pnpm dev

# Build (static output to dist/)
pnpm build

# Preview production build
pnpm preview

# Package management — uses pnpm, NOT npm
pnpm install
```

## Architecture

```
src/
├── components/
│   ├── BioCard.astro           # Bio sidebar card (landing page)
│   ├── BlogCard.astro          # Blog post card
│   ├── Header.astro            # Sticky header with nav + dark mode toggle
│   ├── Footer.astro            # Footer with social links
│   ├── ObfuscatedEmail.astro   # Email obfuscation (ROT13 + reverse)
│   └── mdx/
│       ├── Alert.astro         # Alert boxes (success/warning/info/danger)
│       ├── Video.astro         # Video embed (WebM)
│       └── Mermaid.astro       # Mermaid diagrams (client-side)
├── content/
│   └── posts/<category>/<slug>/  # Blog posts (md/mdx + assets)
├── data/
│   └── portfolio.ts            # Author, skills, experience, certifications, talks
├── layouts/
│   ├── BaseLayout.astro        # Base HTML with SEO meta, dark mode, GA4
│   └── PostLayout.astro        # Blog post layout with TOC sidebar
├── pages/
│   ├── index.astro             # Landing page (bento grid: bio + posts)
│   ├── about.astro             # Full portfolio page
│   ├── index.xml.ts            # Atom RSS feed
│   └── posts/[category]/[...slug].astro  # Dynamic blog post route
├── styles/
│   └── global.css              # Tailwind v4 config + theme tokens
└── content.config.ts           # Content collection schema (Zod)
public/
├── _redirects                  # Cloudflare Pages redirects
├── robots.txt                  # Bot rules
├── llms.txt                    # LLM-readable site info
└── images/                     # Static images (profile photo, skill logos, etc.)
```

### Key Config Files

| File | Purpose |
|---|---|
| `astro.config.mjs` | Astro config: static output, Tailwind via Vite plugin, MDX, sitemap |
| `src/content.config.ts` | Content collection schema using glob loader |
| `src/styles/global.css` | Tailwind v4 `@theme` block with custom tokens |
| `tsconfig.json` | TypeScript strict, path alias `@/*` -> `src/*` |

### Content Collections (Astro 5)

Uses glob loader (not file-based). Post IDs include category path: `cloud/how-to-setup-aws...`

```typescript
// Rendering a post (Astro 5 API)
import { getCollection, render } from 'astro:content';
const { Content, headings } = await render(post);  // NOT post.render()
```

Post URLs: `/posts/${post.id}/` (id already includes `category/slug`).

## Blog Post Front Matter

```yaml
title: "Post Title"
date: "YYYY-MM-DD"
description: |
  Multi-line description
hero: ./hero-image.svg          # Relative path for image optimization
tags: [tag1, tag2]
category: cloud                 # cloud | development | kubernetes
draft: false                    # Optional, defaults to false
```

### MDX Posts

Posts with interactive components use `.mdx` extension. Import components at the top:

```mdx
import Alert from '../../../components/mdx/Alert.astro';
import Video from '../../../components/mdx/Video.astro';
import Mermaid from '../../../components/mdx/Mermaid.astro';
```

## Deployment

- **Cloudflare Pages**: primary deployment target
- **GitHub Actions**: `.github/workflows/cloudflare-deploy.yml`
- Build output: `dist/`
- Google Analytics: `G-0B464DB9YX`

---

# Theme Implementation

### Key Files
- **Tokens**: `src/styles/global.css` — `@theme` block with fonts and category colors
- **Toggle**: `src/components/Header.astro` — Sun/Moon button (vanilla JS)
- **FOUC prevention**: Inline `<script is:inline>` in `BaseLayout.astro` reads `localStorage('theme')` before first paint

### Theme Persistence
- Stored in `localStorage` key `theme`
- Light = default (no class), Dark = `.dark` class on `<html>`
- SSR-safe: inline script runs before paint, reads `localStorage` / `prefers-color-scheme`
- Tailwind custom variant: `@custom-variant dark (&:where(.dark, .dark *))`

## Color Usage Rules

Use Tailwind `dark:` variants for all color values. Every visible element needs both light and dark styles.

### Dark Mode Pattern

```html
<!-- Background -->
bg-white dark:bg-gray-900
bg-gray-50 dark:bg-gray-900/50
bg-gray-100 dark:bg-gray-800

<!-- Text -->
text-gray-900 dark:text-gray-100       <!-- Primary -->
text-gray-600 dark:text-gray-300       <!-- Secondary -->
text-gray-500 dark:text-gray-400       <!-- Muted -->

<!-- Borders -->
border-gray-200 dark:border-gray-800

<!-- Interactive -->
hover:text-gray-900 dark:hover:text-gray-100
hover:bg-gray-100 dark:hover:bg-gray-800
```

### Category Colors

| Category | Color | Token |
|---|---|---|
| Cloud | Blue | `--color-cloud: #3b82f6` |
| Development | Green | `--color-development: #10b981` |
| Kubernetes | Purple | `--color-kubernetes: #8b5cf6` |

Badge pattern: `bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300`

### Glassmorphism

Used for header and bio card:
```html
bg-white/80 dark:bg-gray-950/80 backdrop-blur-md  <!-- Header -->
bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm  <!-- BioCard -->
```

## Fonts
- **Body**: Inter — loaded via system font stack (`--font-sans`)
- **Code**: JetBrains Mono — loaded via system font stack (`--font-mono`)
- Syntax highlighting: Shiki with `github-light` / `github-dark` themes

---

# Design System — Bento Grid

The site uses a bento grid layout as its primary visual language. The landing page features a two-column layout (bio sidebar + post cards), and the about page uses bento-style section cards.

## Core Philosophy

- **Modular compartments**: Every section is a self-contained card with clear boundaries
- **Asymmetric balance**: Bio sidebar (280px) + blog posts grid (fluid)
- **Visual hierarchy through size**: Featured content gets larger cards
- **Breathing room**: Consistent `gap-4` / `gap-6` spacing between all cards
- **Content-first**: Blog is the landing page, not a portfolio hero

## Grid Implementation

### Landing Page Layout

```html
<!-- Two-column: sticky bio (280px) + post grid -->
<div class="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
  <aside class="lg:sticky lg:top-20 lg:self-start">
    <BioCard />
  </aside>
  <section>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      {posts.map(post => <BlogCard {post} />)}
    </div>
  </section>
</div>
```

### About Page Layout

```html
<!-- Stacked bento sections -->
<div class="space-y-12">
  <section class="rounded-3xl border ...">Hero/Intro</section>
  <section>Skills grid (3-col)</section>
  <section>Experience timeline</section>
  <section>Certifications (2-col)</section>
  <section>Presentations</section>
</div>
```

### Card Sizing

| Variant | Tailwind Classes | Use Case |
|---|---|---|
| **Post card** | `rounded-2xl` | Blog post in grid |
| **Bio card** | `rounded-3xl` | Sidebar bio |
| **Section card** | `rounded-2xl` or `rounded-3xl` | About page sections |
| **Full-width** | `rounded-3xl` | Hero/intro on about page |

### Responsive Breakpoints

| Breakpoint | Landing Layout | Post Grid |
|---|---|---|
| `< 1024px` | Single column (bio stacks above) | 1 column |
| `>= 768px` | Single column | 2 columns |
| `>= 1024px` | Two-column (280px + fluid) | 2 columns |

## Visual Design Rules

### Spacing & Gaps

- **Between grid sections**: `gap-6` (24px)
- **Between post cards**: `gap-4` (16px)
- **Card inner padding**: `p-5` (post cards), `p-6` (bio card), `p-8` (hero sections)
- **Page container**: `max-w-7xl mx-auto px-4 py-8`
- Never mix gap values in the same grid

### Border Radius

- **Section cards**: `rounded-3xl` (24px) for primary containers
- **Content cards**: `rounded-2xl` (16px) for post cards, skill cards, etc.
- **Badges/tags**: `rounded-full` (pill) or `rounded-md` (small tags)
- **Images in cards**: `rounded-xl` (12px)
- Hierarchy: container > card > inner element

### Elevation & Borders

- Default: `border border-gray-200 dark:border-gray-800` + `shadow-sm`
- Hover (interactive): `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`
- Cards use border + subtle shadow, never heavy drop shadows
- Dark mode relies more on borders than shadows

### Typography

- **Page title**: `text-3xl font-bold tracking-tight sm:text-4xl`
- **Section heading**: `text-2xl font-bold`
- **Card title**: `text-lg font-semibold leading-snug`
- **Card description**: `text-sm text-gray-600 dark:text-gray-400`
- **Meta/labels**: `text-xs text-gray-500 dark:text-gray-500`
- **Prose content**: `prose prose-lg dark:prose-invert` (via `@tailwindcss/typography`)

### Hover Effects

Post cards lift on hover:
```html
class="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
```

Hero images zoom on hover:
```html
class="group-hover:scale-105 transition-transform duration-300"
```

Keep effects subtle. Never scale entire cards.

## Anti-Patterns — Do NOT

- Never mix gap sizes in the same grid
- Never use heavy drop shadows or glowing borders
- Never scale cards on hover (only translate + shadow)
- Never nest grids inside grid cards
- Never create cards without clear content purpose
- Never hardcode pixel widths on cards — they must be fluid within the grid
- Never use inconsistent border-radius values across cards at the same level

---

# Email Obfuscation

`ObfuscatedEmail.astro` protects email addresses from bots:

1. **Server-side**: Reverses email string, then applies ROT13 → stored in `data-e` attribute
2. **Client-side JS**: Decodes (ROT13 then reverse) and sets `mailto:` href
3. **Without JS**: Email is completely unreadable, link goes to `#`

Used in `BioCard.astro` and `Footer.astro` for the mail social link.

---

# SEO & Performance

## Per-Page Meta Tags

Set via `BaseLayout.astro` props:

```astro
<BaseLayout
  title="Page Title"
  description="Page description"
  image="/path/to/og-image.jpg"
  canonicalUrl="https://mjasion.pl/custom-url/"
/>
```

Generates: `<title>`, `<meta description>`, OpenGraph, Twitter Card, canonical URL.

Title format: `"{title} | Marcin Jasion"` (except homepage which is just `"Marcin Jasion"`).

## Static SEO Files

- `public/robots.txt` — Blocks TurnitinBot, NPBot, SlySearch; points to sitemap
- `public/_redirects` — Cloudflare Pages redirects (`/blog` -> `/`, `/talks` -> `/about/#presentations`)
- Sitemap auto-generated by `@astrojs/sitemap` at `/sitemap-index.xml`

## RSS Feed

`src/pages/index.xml.ts` — Atom feed at `/index.xml`:
- 10 most recent posts
- UTM parameters (`?utm_source=atom_feed`)
- CDATA content wrapping
- Description rendered as blockquote

## Performance

- Static site generation (zero JS by default, except dark mode toggle + mermaid)
- Image optimization via Sharp (auto WebP conversion)
- Shiki syntax highlighting (built-in, no client JS)
- `loading="lazy"` on all images except hero/profile
- Glassmorphism header with `backdrop-blur-md`

---

# Code Conventions

## Component Structure

- **Astro components** (`.astro`) for all UI — no React/Vue/Svelte
- **TypeScript** in frontmatter for type safety
- **Vanilla JS** in `<script>` tags for client interactivity (dark mode, email decode)
- Use `is:inline` for scripts that must run before hydration (dark mode in `<head>`)

## Naming Conventions

- **Components**: PascalCase — `BioCard.astro`, `BlogCard.astro`
- **Layouts**: PascalCase — `BaseLayout.astro`, `PostLayout.astro`
- **Data files**: camelCase — `portfolio.ts`
- **Content**: kebab-case directories — `posts/cloud/how-to-setup-aws.../`
- **CSS variables**: `--color-*` prefix for theme tokens, `--font-*` for fonts

## TypeScript

- Strict mode enabled (extends `astro/tsconfigs/strict`)
- Use `interface` for component props
- Content collection types via `CollectionEntry<'posts'>`
- Path alias: `@/*` maps to `src/*`

## Component Guidelines

- Keep components focused — one clear purpose per file
- Use `class:list` for conditional Tailwind classes
- All images need `alt` text, `loading="lazy"` (except above-the-fold)
- Social link icons are inline SVGs (no icon library dependency)
- Portfolio data lives in `src/data/portfolio.ts`, not in components

---

# Critical Rules

1. **NEVER auto-commit changes** — Only commit when the user explicitly asks or uses /commit.
2. **Never push to remote without explicit user request.**
3. **Always pair light and dark styles** — Every `bg-*`, `text-*`, `border-*` needs a `dark:` variant.
4. **Bento grid consistency** — New pages/sections must follow the bento card system. No one-off layouts.
5. **Mobile-first** — Responsive styles start from mobile, scale up. Test at 375px, 768px, 1280px.
6. **Accessibility** — Every interactive element needs keyboard support. Every image needs alt text. Semantic HTML (`<nav>`, `<article>`, `<section>`, `<aside>`).
7. **Zero client JS by default** — Only add `<script>` tags when truly needed (dark mode, email decode, mermaid). No JS frameworks.
8. **Content-first URLs** — Blog posts at `/posts/{category}/{slug}/`. No URL changes without redirect.
9. **Package manager** — Always use `pnpm`, never `npm` or `yarn`.
10. **Static output only** — `output: 'static'` in Astro config. No SSR, no server endpoints.

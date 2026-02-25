# Astro Migration Plan — mjasion.pl

## Executive Summary

Migrate mjasion.pl from Hugo + Toha theme to **Astro** with React islands, Tailwind CSS, and modern tooling. This delivers better performance (automatic image optimization, partial hydration), full control over templates, and a modern developer experience while preserving all existing content.

---

## 1. Why Astro?

| Criterion | Hugo + Toha | Astro |
|---|---|---|
| **Performance** | Good static output, but theme bloat (unused CSS/JS) | Zero JS by default, islands architecture for interactivity |
| **Image optimization** | Manual Hugo pipes (`Resize`, `Process`) | Built-in `<Image>` component with automatic WebP/AVIF, responsive srcsets |
| **SEO control** | Limited by theme templates | Full control via `astro-seo` or manual `<head>` |
| **Styling** | Theme CSS (Bootstrap), hard to customize | Tailwind CSS, fully customizable |
| **Content** | Markdown with Hugo shortcodes | Markdown/MDX with full component support |
| **Interactivity** | Global JS bundles | React islands — JS only where needed |
| **DX** | Go templates, slow iteration | TypeScript/JSX, hot reload, familiar tooling |
| **Deployment** | Cloudflare Pages (static) | Cloudflare Pages (static or SSR via adapter) |

### Why not full React SPA (Next.js, TanStack Router)?

- A personal blog/portfolio is primarily **static content** — full client-side routing adds unnecessary JS
- Astro outputs zero JS by default; React components are only hydrated where interactivity is needed (typing animation, dark mode toggle, search)
- Astro's content collections provide type-safe Markdown handling out of the box
- Better Core Web Vitals (no hydration waterfall, smaller bundles)

---

## 2. Target Architecture

```
mjasion.pl/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── BlogCard.astro
│   │   ├── NoteCard.astro
│   │   ├── ProjectCard.astro
│   │   ├── TypingCarousel.tsx     # React island (interactive)
│   │   ├── DarkModeToggle.tsx     # React island (interactive)
│   │   ├── SearchDialog.tsx       # React island (interactive)
│   │   └── ShareButtons.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro       # <html>, <head>, analytics, OG tags
│   │   ├── BlogLayout.astro       # Blog post layout with TOC, share buttons
│   │   └── NoteLayout.astro       # Note layout
│   ├── pages/
│   │   ├── index.astro            # Homepage (hero + sections)
│   │   ├── posts/
│   │   │   ├── index.astro        # Blog listing with pagination
│   │   │   └── [...slug].astro    # Dynamic blog post pages
│   │   ├── notes/
│   │   │   ├── index.astro        # Notes listing
│   │   │   └── [...slug].astro    # Dynamic note pages
│   │   ├── rss.xml.ts             # RSS feed generation
│   │   ├── sitemap.xml.ts         # Sitemap (or use @astrojs/sitemap)
│   │   └── 404.astro
│   ├── content/
│   │   ├── config.ts              # Content collection schemas (Zod)
│   │   ├── posts/                 # Migrated from content/posts/
│   │   │   ├── kubernetes/
│   │   │   │   └── how-to-debug-istio/
│   │   │   │       ├── index.md
│   │   │   │       └── hero.svg
│   │   │   └── development/
│   │   │       └── label-gitlab-notifications/
│   │   │           └── index.md
│   │   └── notes/                 # Migrated from content/notes/
│   ├── data/                      # Static data (author, sections, etc.)
│   │   ├── author.ts
│   │   ├── sections.ts
│   │   └── presentations.ts
│   ├── styles/
│   │   └── global.css             # Tailwind directives + custom styles
│   └── utils/
│       ├── reading-time.ts
│       └── og-image.ts            # Dynamic OG image generation (optional)
├── public/
│   ├── images/
│   ├── files/
│   └── _redirects
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

### Key Dependencies

```json
{
  "dependencies": {
    "astro": "^5.x",
    "@astrojs/react": "^4.x",
    "@astrojs/tailwind": "^6.x",
    "@astrojs/sitemap": "^3.x",
    "@astrojs/rss": "^4.x",
    "@astrojs/cloudflare": "^12.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    "astro-seo": "^0.8.x"
  },
  "devDependencies": {
    "tailwindcss": "^4.x",
    "typescript": "^5.x",
    "@tailwindcss/typography": "^0.5.x"
  }
}
```

---

## 3. Content Migration Strategy

### 3.1 Markdown / Front Matter

Existing Hugo Markdown files can be reused with minimal changes:

| Hugo Front Matter | Astro Content Collection | Action |
|---|---|---|
| `title`, `date`, `description` | Same | No change |
| `hero: image.svg` | `heroImage: ./image.svg` | Rename field, relative path |
| `author.name` | `author: string` | Flatten |
| `menu.sidebar.*` | `category: string` | Simplify to category string |
| `tags` | `tags: string[]` | No change |

**Migration script** (Node.js):
1. Walk `content/posts/` and `content/notes/`
2. Parse YAML front matter
3. Transform `menu.sidebar.parent` → `category`
4. Transform `hero` → `heroImage` with relative path
5. Remove Hugo-specific fields (`menu`, `sidebar`)
6. Write to `src/content/posts/` and `src/content/notes/`

### 3.2 Hugo Shortcodes → Astro Components / MDX

| Hugo Shortcode | Astro Replacement |
|---|---|
| `{{< video >}}` | `<Video />` MDX component or remark plugin |
| `{{< embed-pdf >}}` | `<EmbedPdf />` component |
| `{{< mermaid >}}` | `<Mermaid />` component (use `mermaid` npm package) |
| `{{< img >}}` | Astro `<Image>` component |
| `{{< highlight >}}` | Built-in code fences with Shiki (Astro default) |
| `{{< alert >}}` | `<Alert />` Astro component |

**Approach**: Convert `.md` files using shortcodes to `.mdx` and import components. Files without shortcodes can remain as `.md`.

### 3.3 Content Collection Schema

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    heroImage: image().optional(),
    author: z.string().default('Marcin Jasion'),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, notes };
```

---

## 4. Component Architecture

### 4.1 Homepage Sections

The current homepage is built from numbered YAML files in `data/en/sections/`. In Astro, these become typed data files + dedicated section components:

```
src/components/sections/
├── Hero.astro              # Background image, typing carousel, avatar
├── About.astro             # Bio, skills, soft skills
├── Skills.astro            # Technical skills grid
├── Education.astro         # Education timeline
├── Experiences.astro       # Work experience timeline
├── Projects.astro          # Project cards grid
├── Presentations.astro     # Talks / presentations list
├── RecentPosts.astro       # Latest blog posts
└── Achievements.astro      # Certifications, awards
```

Each section reads from typed data in `src/data/` and renders independently:

```astro
---
// src/components/sections/Hero.astro
import { author } from '../../data/author';
import TypingCarousel from '../TypingCarousel.tsx';
import { Image } from 'astro:assets';
import authorPhoto from '../../assets/images/mjasion.jpg';
---

<section id="home" class="min-h-screen bg-cover bg-center flex items-center justify-center">
  <div class="text-center">
    <Image
      src={authorPhoto}
      alt={author.name}
      width={148}
      height={148}
      class="rounded-full mx-auto"
      loading="eager"
      fetchpriority="high"
    />
    <h1 class="text-4xl font-bold mt-4">{author.greeting} {author.name}</h1>
    <TypingCarousel client:idle phrases={author.summary} />
  </div>
</section>
```

### 4.2 Interactive Components (React Islands)

Only these components need client-side JavaScript:

| Component | Hydration | Purpose |
|---|---|---|
| `TypingCarousel.tsx` | `client:idle` | Typing animation on homepage |
| `DarkModeToggle.tsx` | `client:load` | Theme switcher (needs immediate load) |
| `SearchDialog.tsx` | `client:idle` | Site search (Pagefind or Fuse.js) |
| `MobileNav.tsx` | `client:media="(max-width: 768px)"` | Mobile hamburger menu |

Everything else is static Astro components — zero JS shipped.

### 4.3 Blog Post Page

```astro
---
// src/pages/posts/[...slug].astro
import { getCollection } from 'astro:content';
import BlogLayout from '../../layouts/BlogLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content, headings } = await post.render();
---

<BlogLayout title={post.data.title} description={post.data.description}>
  <article class="prose prose-lg max-w-none">
    <Content />
  </article>
</BlogLayout>
```

---

## 5. Image Optimization

### Current State (Hugo)
- Manual `Resize` and `Process` calls in templates
- Background image: 427 KB PNG → manually converted to WebP variants
- No automatic responsive images in blog posts

### Astro Solution
- **`<Image>` component**: Automatic WebP/AVIF conversion, responsive srcsets, lazy loading
- **Content images**: Use `![]()` in Markdown — Astro optimizes automatically via `astro:assets`
- **Background images**: Use `getImage()` helper for CSS background images
- **OG images**: Optional dynamic generation with `@vercel/og` or `satori`

```astro
---
import { Image } from 'astro:assets';
import heroImage from './hero.png';
---
<!-- Automatically generates WebP/AVIF, responsive srcset, width/height -->
<Image src={heroImage} alt="Hero" widths={[400, 800, 1200]} />
```

**Expected improvement**: All images automatically optimized — no manual Hugo pipes needed. Estimated 60-80% size reduction across the site.

---

## 6. SEO Setup

### astro-seo Integration

```astro
---
// src/layouts/BaseLayout.astro
import { SEO } from 'astro-seo';
const { title, description, image } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<html lang="en">
<head>
  <SEO
    title={title}
    description={description}
    canonical={canonicalURL.href}
    openGraph={{
      basic: {
        title: title,
        type: "website",
        image: image || "/images/mjasion.jpg",
        url: canonicalURL.href,
      },
      optional: {
        siteName: "Marcin Jasion - Pragmatic DevOps",
        description: description,
      },
    }}
    twitter={{
      card: "summary",
      title: title,
      description: description,
      image: image || "/images/mjasion.jpg",
    }}
  />
  <!-- Structured data, analytics, etc. -->
</head>
```

### Additional SEO Features
- `@astrojs/sitemap` — automatic sitemap generation
- `@astrojs/rss` — RSS feed from content collections
- `robots.txt` — static file in `public/`
- Structured data (JSON-LD) for blog posts and person schema
- Canonical URLs on every page

---

## 7. Styling with Tailwind CSS

### Approach
- Use **Tailwind CSS v4** with `@tailwindcss/typography` for prose styling
- Replace Bootstrap classes with Tailwind utilities
- Use CSS variables for theming (dark mode via `class` strategy)

### Key Mappings from Bootstrap → Tailwind

| Bootstrap | Tailwind |
|---|---|
| `container-fluid` | `w-full px-4` or `max-w-7xl mx-auto` |
| `rounded-circle` | `rounded-full` |
| `d-block mx-auto` | `block mx-auto` |
| `img-fluid` | `max-w-full h-auto` |
| `text-center` | `text-center` |
| `row` / `col-md-6` | `grid grid-cols-1 md:grid-cols-2 gap-4` |

### Dark Mode

```javascript
// tailwind.config.mjs
export default {
  darkMode: 'class',
  // ...
};
```

Toggle via `DarkModeToggle.tsx` React island that adds/removes `dark` class on `<html>` and persists preference to `localStorage`.

---

## 8. Deployment (Cloudflare Pages)

### Configuration

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://mjasion.pl',
  output: 'static',          // Pure static for now; switch to 'server' if needed
  adapter: cloudflare(),
  integrations: [
    react(),
    tailwind(),
    sitemap(),
  ],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
```

### Build Command
```bash
pnpm build
```

### Redirects
Reuse existing `_redirects` file in `public/` directory — Cloudflare Pages supports it natively.

### GitHub Actions
Update `.github/workflows/cloudflare-deploy.yml`:
- Change build command from `./build.sh` to `pnpm build`
- Output directory from Hugo's `public/` to Astro's `dist/`

---

## 9. Feature Parity Checklist

| Feature | Hugo/Toha | Astro Plan | Priority |
|---|---|---|---|
| Homepage hero with typing animation | Toha theme | `Hero.astro` + `TypingCarousel.tsx` | P0 |
| Dark mode | darkreader library | `DarkModeToggle.tsx` + Tailwind `dark:` | P0 |
| Blog posts with categories | Hugo taxonomy | Content collections + dynamic routes | P0 |
| Notes section | Hugo section | Content collection | P0 |
| RSS feed | Hugo built-in | `@astrojs/rss` | P0 |
| Sitemap | Hugo built-in | `@astrojs/sitemap` | P0 |
| SEO meta tags | Custom overrides | `astro-seo` | P0 |
| Table of Contents | Toha theme | `headings` from `post.render()` | P1 |
| Code syntax highlighting | highlight.js | Shiki (Astro built-in) | P0 |
| Copy code button | Toha theme | Custom Astro component | P1 |
| Share buttons | Toha theme | `ShareButtons.astro` | P2 |
| Reading time | Toha theme | `reading-time` npm package | P1 |
| About / Skills sections | Toha YAML | Typed data files + components | P1 |
| Experience timeline | Toha YAML | Custom component | P1 |
| Projects grid | Toha YAML | Custom component | P1 |
| Presentations section | Custom partial | Dedicated component | P1 |
| Google Analytics | Toha integration | `@astrojs/partytown` + inline script | P0 |
| Mermaid diagrams | Toha shortcode | MDX + `mermaid` package | P2 |
| PDF embedding | Toha shortcode | `<EmbedPdf />` component | P2 |
| Video player | Toha shortcode (plyr) | `<Video />` component | P2 |
| Search | Not implemented | Pagefind (static search) | P2 |
| Comments (Giscus) | Configured but disabled | `<Giscus />` React island | P3 |

---

## 10. Migration Phases

### Phase 1: Foundation (1-2 days)
- [ ] Initialize Astro project with React, Tailwind, TypeScript
- [ ] Set up `astro.config.mjs` with Cloudflare adapter
- [ ] Create `BaseLayout.astro` with SEO, analytics, dark mode
- [ ] Set up Tailwind config with typography plugin
- [ ] Create `Header.astro` and `Footer.astro`
- [ ] Set up dark mode toggle (React island)

### Phase 2: Content Migration (1-2 days)
- [ ] Define content collection schemas (`posts`, `notes`)
- [ ] Write migration script for front matter transformation
- [ ] Copy and transform all Markdown files
- [ ] Convert shortcode-heavy files to MDX
- [ ] Create `BlogLayout.astro` with TOC, reading time, share buttons
- [ ] Create blog listing page with pagination
- [ ] Create note listing and detail pages
- [ ] Set up RSS feed and sitemap

### Phase 3: Homepage (1-2 days)
- [ ] Migrate author data to typed TypeScript files
- [ ] Migrate section data (skills, experience, education, projects)
- [ ] Build `Hero.astro` with typing carousel
- [ ] Build `About.astro`, `Skills.astro`, `Experiences.astro`
- [ ] Build `Education.astro`, `Projects.astro`
- [ ] Build `Presentations.astro` (migrate custom partial)
- [ ] Build `RecentPosts.astro`

### Phase 4: Polish & Deploy (1 day)
- [ ] Implement redirects (`_redirects` file)
- [ ] Add Pagefind search (optional)
- [ ] Test all pages for visual parity
- [ ] Run Lighthouse audit — target: Performance 98+, SEO 100
- [ ] Update GitHub Actions workflow
- [ ] Deploy to Cloudflare Pages
- [ ] Verify production site

### Phase 5: Enhancements (post-launch)
- [ ] Dynamic OG image generation
- [ ] View transitions (Astro native)
- [ ] Comments via Giscus (React island)
- [ ] i18n support if needed
- [ ] Analytics dashboard integration

---

## 11. Risk Mitigation

| Risk | Mitigation |
|---|---|
| URL changes break SEO | Keep identical URL structure (`/posts/<category>/<slug>/`); use `_redirects` for any changes |
| Missing features at launch | Prioritize P0 features; defer P2/P3 to post-launch |
| Content formatting differences | Visual regression testing with screenshots before/after |
| Build time increase | Astro builds are fast; content collections are cached |
| Cloudflare Pages compatibility | Use official `@astrojs/cloudflare` adapter; test early |

---

## 12. Expected Performance Gains

| Metric | Current (Hugo) | Expected (Astro) | Improvement |
|---|---|---|---|
| **JS bundle size** | ~150 KB (Bootstrap + theme JS) | ~5-15 KB (only islands) | 90%+ reduction |
| **CSS size** | ~100 KB (Bootstrap + theme CSS) | ~15-30 KB (Tailwind purged) | 70%+ reduction |
| **LCP** | 21.1s (throttled 4G) | <4s | 5x faster |
| **FCP** | 10.6s (throttled 4G) | <3s | 3x faster |
| **TBT** | 330ms | <50ms | 85% reduction |
| **Lighthouse Performance** | 93 | 98+ | Near perfect |
| **Lighthouse SEO** | 48 → ~95 (after fixes) | 100 | Full score |

---

## Summary

The migration from Hugo/Toha to Astro is a medium-effort project (~5-7 days) that delivers significant performance improvements, full template control, modern DX, and eliminates dependency on the Toha theme. The existing Markdown content migrates with minimal transformation, and the Cloudflare Pages deployment remains unchanged.

**Recommended approach**: Run both sites in parallel during migration. Deploy the Astro version to a preview URL on Cloudflare Pages, validate feature parity and performance, then switch the production domain.

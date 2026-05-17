---
name: ai-search-optimization
description: When the user wants to optimize content or technical setup for AI features in Google Search (AI Overviews, AI Mode, generative AI results). Use when the user mentions "AI SEO", "AI Overviews", "generative AI search", "AI optimization", "optimize for AI", "LLM SEO", or asks how to make blog posts/pages discoverable by AI. Based on Google's official AI optimization guide (developers.google.com/search/docs/fundamentals/ai-optimization-guide).
metadata:
  version: 1.0.0
  source: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
---

# AI Search Optimization

Audit and improve a page or the whole site for visibility in Google's generative AI features (AI Overviews, AI Mode). Based **strictly** on Google's official guide — no AI-SEO myths, no special markup, no chunking tricks.

## Core principle

> **Optimizing for generative AI search is optimizing for the search experience — and thus still SEO.**

If the page is not eligible for normal Google Search snippets, it will not appear in AI features. AI Overviews use the same index and the same ranking signals. There is no separate "AI ranking" to game.

---

## What Google ACTUALLY recommends

### 1. Create valuable, non-commodity content

Audit each post against these attributes:

| Attribute | What to check on this site |
|---|---|
| **Unique perspective** | First-hand experience, original data, things you tested yourself. Generic "10 tips for Kubernetes" gets skipped — concrete production stories don't. |
| **People-first** | Written for a human reader, not to rank for a keyword pattern. |
| **Clear structure** | Descriptive H2/H3 headings, logical paragraphs, scannable sections. (PostLayout's TOC reflects this — bad headings = bad TOC.) |
| **Multimedia** | Hero image, inline diagrams (Mermaid component already supports this), screenshots, video where it adds value. |
| **No scaled commodity content** | Don't publish many slight variations of the same post to chase keywords — violates scaled content abuse policy. |
| **AI-assisted content** | Allowed, but must meet Search Essentials and spam policies. Editorial review is required. |

**Decision rule:** if the post could be replaced by a generic AI summary of three competitor articles, it adds no value to an AI Overview either. Add what only the author knows.

### 2. Build clear technical structure

These are baseline SEO requirements — AI features cannot surface a page that fails them.

- **Indexable**: page must be crawlable and eligible for normal Search snippets. (Check: not blocked by robots.txt, no `noindex`, canonical points at itself.)
- **Crawlable**: publicly accessible HTML. No auth wall, no critical content behind JS that fails to render.
- **Semantic HTML**: real `<article>`, `<section>`, `<nav>`, `<h1>`–`<h6>`, `<figure>`/`<figcaption>`. Helps both accessibility tree and AI parsing.
- **JavaScript SEO**: this site is static Astro output, so this is mostly fine — but verify that any client-rendered content (Mermaid diagrams, copy buttons) is not the only place where information lives.
- **Page experience**: responsive, fast, clear main content vs. chrome. Run the `pagespeed-insights` skill for Core Web Vitals.
- **Reduce duplicate content**: tags pages, archives, and category listings should not compete with canonical post URLs. The `<link rel="canonical">` in `BaseLayout` must point at the canonical post URL.

**How Google's AI features pull content:**

- **RAG (retrieval-augmented generation)** — the model retrieves relevant indexed pages and grounds answers with clickable source links. So: get indexed, rank for the underlying query, get cited.
- **Query fan-out** — for a query like "best AWS region for low-latency Europe", Google issues several related sub-queries ("AWS Frankfurt vs Dublin latency", "AWS region pricing", etc.). A post that covers a topic deeply, across related sub-questions, can be picked up across multiple fan-out queries.

**Practical takeaway for this blog:** prefer one deep, comprehensive post over five thin ones on adjacent sub-questions. Use H2/H3 sections to cover the natural sub-questions inside it.

### 3. Optimize business / commerce details (when applicable)

Not directly relevant for this personal blog, but for completeness:

- Google Merchant Center feeds → product visibility in AI shopping results.
- Google Business Profile → local/business mentions in AI answers.
- Business Agent for conversational customer interactions.

### 4. Agentic experiences (forward-looking)

Browser agents read visual rendering + DOM + accessibility tree. Things that help:

- Semantic HTML and ARIA where appropriate.
- Form labels, button text that describes the action.
- No critical UI that only works behind hover-only interactions.

Emerging protocols (Universal Commerce Protocol etc.) will let agents do more — keep an eye on, don't preemptively implement.

---

## What to IGNORE (Google says these don't help)

Reject these if a stakeholder or AI-SEO tool suggests them:

| Anti-pattern | Why Google rejects it |
|---|---|
| **`llms.txt` files** | "No advantage." This site has one in `/public/llms.txt` — fine to keep as a curiosity, but do **not** treat it as an AI-SEO win. |
| **Content chunking for AI** | Unnecessary. AI systems handle nuanced multi-topic pages. Don't fragment posts artificially. |
| **AI-specific rewriting tone** | Don't rewrite content into "AI-friendly" robotic prose. Synonyms and semantic variations are understood. |
| **Inauthentic brand mentions** | Buying mentions / link spam doesn't move AI Overviews. Quality + spam detection dominate. |
| **Mandatory structured data for AI** | Structured data is **not required** for AI search eligibility. (Still useful for rich results — keep the existing JSON-LD for `BlogPosting`, `BreadcrumbList`, `Person`, `WebSite`.) |
| **Generic "AI optimization" plugins** | If a tool's pitch is AI-specific tricks rather than SEO fundamentals, skip it. |

---

## Audit framework for this Astro blog

### Step 1 — Indexability & crawlability (must-pass gates)

For each post being audited:

1. URL returns 200, not noindex. Check `<head>` of the rendered page.
2. Canonical URL in `BaseLayout` matches the actual published URL — `https://mjasion.pl/posts/{category}/{slug}/`.
3. Listed in `/sitemap-index.xml` (auto-generated by `@astrojs/sitemap`).
4. Listed in `/index.xml` (Atom feed) if recent.
5. Not blocked in `public/robots.txt`.
6. Content is in the static HTML (Astro static output), not injected via client JS. Verify with `curl -s https://mjasion.pl/posts/... | grep -i '<some content phrase>'`.

### Step 2 — Content quality check

For the post body:

- **Original angle**: does this post say something the author learned, broke, fixed, measured, or built? Or is it a rephrasing of docs?
- **Depth**: does it cover the obvious follow-up questions a reader will have? List them — each one is a fan-out query Google may issue.
- **Scannability**: H2 per major section, H3 for sub-points. The TOC sidebar in `PostLayout` is a free readability check — if the TOC reads weirdly, the headings are weird.
- **Multimedia**: hero image present (front-matter `hero:` field), code blocks have language tag for Shiki, diagrams use the Mermaid component instead of screenshots where possible.
- **Freshness**: posts about cloud/k8s versions go stale fast. Either update the `date:` and note "updated YYYY-MM-DD", or accept it as a dated reference.

### Step 3 — Technical signals

- **Page experience**: run `pagespeed-insights` skill on the post. LCP < 2.5s, INP < 200ms, CLS < 0.1.
- **Images**: `alt` text describes the image (not "image" or filename), modern formats via Astro Image, `loading="lazy"` except above-the-fold.
- **Internal linking**: post links to related posts on this site where natural. Orphan posts hurt — every post should be reachable from at least one other post or tag page.
- **Heading hierarchy**: exactly one H1 (the post title, rendered by `PostLayout`). Body content uses H2 and below.
- **Semantic HTML**: code in `<pre><code>`, lists as real `<ul>`/`<ol>`, tables as real `<table>`. Markdown handles this — flag MDX components that bypass it.

### Step 4 — Structured data (optional, still nice)

This site already emits in `PostLayout`:

- `BlogPosting` JSON-LD
- `BreadcrumbList` JSON-LD
- `Person` JSON-LD on about page
- `WebSite` JSON-LD on homepage

When auditing, verify each post:

- `BlogPosting.headline` matches `<title>` and `<h1>`.
- `BlogPosting.datePublished` and `dateModified` are accurate.
- `BlogPosting.image` points at a real URL (note the `/@fs/...` dev-mode gotcha — see `MEMORY.md`).
- `author.@id` matches the `Person` schema on `/about/`.

Validate with **Google's Rich Results Test** (https://search.google.com/test/rich-results) — `curl`/`web_fetch` cannot see JS-injected JSON-LD reliably; on this static site they can, but the Rich Results Test confirms Google can.

### Step 5 — OpenGraph & social signals

- `og:type=article` for posts (handled in `PostLayout`).
- `og:image` points at `/og/{category}/{slug}.png` (dynamic OG image generator).
- `twitter:card=summary_large_image` for posts with hero.
- RSS auto-discovery `<link rel="alternate" type="application/atom+xml">` in `BaseLayout`.

---

## Output format

When auditing, structure findings as:

**Executive summary**
- One paragraph: is the page eligible for AI features? What's the biggest gap?

**Eligibility gates (pass/fail)**
- Indexable? Canonical correct? In sitemap? Static content present? — each as Pass/Fail with evidence.

**Content quality findings**
For each issue:
- **Issue**: what's wrong
- **Why it matters for AI features**: which Google guideline it violates (cite the section: "non-commodity", "people-first", etc.)
- **Fix**: concrete edit, file path if applicable

**Technical findings**
Same format. Reference real file paths (`src/layouts/PostLayout.astro`, `src/content.config.ts`, etc.).

**Things explicitly NOT to do**
If during audit something suggested smelled like AI-SEO snake oil (chunking, llms.txt push, "rewrite for LLMs"), call it out and cite Google's "Practices to disregard" section.

**Prioritized action plan**
1. Critical (page not indexable / not eligible)
2. High-impact content gaps (missing depth, no first-hand insight)
3. Quick wins (alt text, internal links, heading fixes)
4. Long-term (topical clustering, freshness cadence)

---

## Task-specific questions

Only ask if the user hasn't already specified scope:

1. Auditing a single post, a category, or the whole site?
2. Target query/topic — what should this page surface for?
3. Any signals from Search Console (impressions, queries, AI Overview appearances)?

---

## Related skills

- `seo-audit` — broader technical SEO audit (foundational gates this skill depends on).
- `pagespeed-insights` — Core Web Vitals + page experience signals.
- `schema-markup` — implementing JSON-LD (already in place via `PostLayout`, but useful for new page types).

---

## Source

Google Search Central — **Get your content ready for AI features in Google Search**:
https://developers.google.com/search/docs/fundamentals/ai-optimization-guide

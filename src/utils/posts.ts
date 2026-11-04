import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

// Cloudflare Pages sets CF_PAGES_BRANCH at build time; anything but main is a preview deployment
const isPreview = !!process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== 'main';

/** A tag gets its own `/tags/{tag}/` page once this many posts carry it. */
export const MIN_POSTS_FOR_TAG_PAGE = 5;

export const SITE_URL = 'https://mjasion.pl';

/**
 * Shared visibility filter for blog posts.
 *
 * - Dev (`pnpm dev`): everything, including `draft: true` and future-dated posts.
 * - Preview deployments: everything too, drafts and future-dated posts included,
 *   so a post can be reviewed on its branch URL before it goes live.
 * - Production: published posts whose date has already arrived.
 *
 *   const posts = await getCollection('posts', isVisible);
 */
export function isVisible({ data }: Post): boolean {
  if (!import.meta.env.PROD || isPreview) return true;
  return !data.draft && data.date <= new Date();
}

/** Visible posts, newest first. */
export async function getSortedPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', isVisible);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Groups items by key, keeping the input order inside each group and first-seen order of the keys. */
export function groupBy<T, K>(items: readonly T[], keyOf: (item: T) => K): Map<K, T[]> {
  const groups = new Map<K, T[]>();
  for (const item of items) {
    const key = keyOf(item);
    const group = groups.get(key);
    if (group) group.push(item);
    else groups.set(key, [item]);
  }
  return groups;
}

/** Posts per category, the biggest category first (ties keep first-seen order). */
export function groupByCategory(posts: readonly Post[]): [string, Post[]][] {
  return [...groupBy(posts, (p) => p.data.category)].sort((a, b) => b[1].length - a[1].length);
}

/** Posts per tag, keeping the input order of posts inside each tag. */
export function groupByTag(posts: readonly Post[]): Map<string, Post[]> {
  const byTag = new Map<string, Post[]>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      const group = byTag.get(tag);
      if (group) group.push(post);
      else byTag.set(tag, [post]);
    }
  }
  return byTag;
}

/** `[tag, count]` pairs, most used first, then alphabetical. */
export function tagCounts(posts: readonly Post[]): [string, number][] {
  return [...groupByTag(posts)]
    .map(([tag, ps]): [string, number] => [tag, ps.length])
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

/** Tags that have a dedicated page (see MIN_POSTS_FOR_TAG_PAGE). */
export function popularTags(posts: readonly Post[]): Set<string> {
  return new Set(tagCounts(posts).filter(([, n]) => n >= MIN_POSTS_FOR_TAG_PAGE).map(([tag]) => tag));
}

/** `cloud/how-to-x` -> `{ category: 'cloud', slug: 'how-to-x' }` (post ids include the category). */
export function postParams(post: Post): { category: string; slug: string } {
  const [category, ...rest] = post.id.split('/');
  return { category, slug: rest.join('/') };
}

export function postPath(post: Post): string {
  return `/posts/${post.id}/`;
}

export function postUrl(post: Post, siteUrl = SITE_URL): string {
  return `${siteUrl}${postPath(post)}`;
}

/** `Astro.site` without the trailing slash, falling back to the production URL. */
export function siteUrlOf(site: URL | undefined): string {
  return site?.toString().replace(/\/$/, '') ?? SITE_URL;
}

/** `YYYY-MM-DD` (UTC, like the front-matter dates). */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// UTC, so a date-only front-matter value ("2026-05-17") never shifts a day with the build machine's zone
const postDateFormat = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});
const monthDayFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

/** `May 17, 2026` */
export function formatPostDate(date: Date): string {
  return postDateFormat.format(date);
}

/** `May 17` */
export function formatMonthDay(date: Date): string {
  return monthDayFormat.format(date);
}

/** `1 post` / `3 posts` */
export function pluralPosts(n: number, noun = 'post'): string {
  return `${n} ${n === 1 ? noun : `${noun}s`}`;
}

/** Description on one line, for list items in the markdown twins. */
export function oneLine(text: string): string {
  return text.replace(/\n/g, ' ').trim();
}

/** Schema.org ItemList of post URLs (CollectionPage `mainEntity`). */
export function postItemList(posts: readonly Post[], siteUrl: string) {
  return {
    '@type': 'ItemList',
    numberOfItems: posts.length,
    itemListElement: posts.map((post, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: postUrl(post, siteUrl),
    })),
  };
}

/** Response for the `.md` twins of the pages (markdown for agents). */
export function markdownResponse(lines: readonly string[]): Response {
  return new Response(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}

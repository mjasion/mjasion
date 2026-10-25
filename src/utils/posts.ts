import type { CollectionEntry } from 'astro:content';

// Cloudflare Pages sets CF_PAGES_BRANCH at build time; anything but main is a preview deployment
const isPreview = !!process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== 'main';

/**
 * Shared visibility filter for blog posts.
 *
 * - Dev (`pnpm dev`): everything, including `draft: true` and future-dated posts.
 * - Preview deployments: published posts, future-dated ones included, so a
 *   scheduled post can be reviewed on its branch URL.
 * - Production: published posts whose date has already arrived.
 *
 *   const posts = await getCollection('posts', isVisible);
 */
export function isVisible({ data }: CollectionEntry<'posts'>): boolean {
  if (!import.meta.env.PROD) return true;
  return !data.draft && (isPreview || data.date <= new Date());
}

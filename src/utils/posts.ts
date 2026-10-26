import type { CollectionEntry } from 'astro:content';

// Cloudflare Pages sets CF_PAGES_BRANCH at build time; anything but main is a preview deployment
const isPreview = !!process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== 'main';

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
export function isVisible({ data }: CollectionEntry<'posts'>): boolean {
  if (!import.meta.env.PROD || isPreview) return true;
  return !data.draft && data.date <= new Date();
}

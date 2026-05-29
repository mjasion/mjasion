import type { CollectionEntry } from 'astro:content';

/**
 * Shared visibility filter for blog posts.
 *
 * - Dev (`pnpm dev`): everything is visible, including `draft: true` and
 *   future-dated posts, so work-in-progress can be previewed locally.
 * - Prod (`pnpm build`): only published (non-draft) posts whose date has
 *   already arrived are included.
 *
 * Pass it straight to `getCollection`:
 *
 *   const posts = await getCollection('posts', isVisible);
 */
export function isVisible({ data }: CollectionEntry<'posts'>): boolean {
  return !import.meta.env.PROD || (!data.draft && data.date <= new Date());
}

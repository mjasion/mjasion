import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Shorter <title> for search results (~60 chars); the page keeps `title`
      seoTitle: z.string().max(60).optional(),
      date: z.coerce.date(),
      description: z.string(),
      hero: image().optional(),
      tags: z.array(z.string()).default([]),
      category: z.enum(['cloud', 'development', 'kubernetes']),
      draft: z.boolean().default(false),
      dateModified: z.coerce.date().optional(),
    }),
});

export const collections = { posts };

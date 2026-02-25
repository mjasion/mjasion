import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      description: z.string(),
      hero: image().optional(),
      tags: z.array(z.string()).default([]),
      category: z.enum(['cloud', 'development', 'kubernetes']),
      draft: z.boolean().default(false),
    }),
});

export const collections = { posts };

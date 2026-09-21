import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { isVisible } from '@/utils/posts';
import { categoryLabels } from '../data/portfolio';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('posts', isVisible))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const categories = new Map<string, typeof posts>();
  for (const post of posts) {
    const cat = post.data.category;
    const existing = categories.get(cat) ?? [];
    existing.push(post);
    categories.set(cat, existing);
  }

  const sortedCategories = Array.from(categories.entries()).sort((a, b) => b[1].length - a[1].length);

  const lines: string[] = [
    '---',
    'title: "All Posts - Marcin Jasion"',
    `description: "Browse all ${posts.length} articles by Marcin Jasion, grouped by category."`,
    'canonical: https://mjasion.pl/posts/',
    '---',
    '',
    '# All Posts',
    '',
    `${posts.length} posts across ${sortedCategories.length} categories.`,
    '',
  ];

  for (const [cat, catPosts] of sortedCategories) {
    const label = categoryLabels[cat] ?? cat;
    lines.push(
      `## [${label}](https://mjasion.pl/posts/${cat}/) (${catPosts.length} ${catPosts.length === 1 ? 'post' : 'posts'})`,
      '',
    );
    for (const post of catPosts) {
      const date = post.data.date.toISOString().slice(0, 10);
      lines.push(`- ${date} - [${post.data.title}](https://mjasion.pl/posts/${post.id}/)`);
    }
    lines.push('');
  }

  return new Response(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
};

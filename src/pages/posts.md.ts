import type { APIRoute } from 'astro';
import { categoryLabels } from '../data/portfolio';
import { getSortedPosts, groupByCategory, isoDate, markdownResponse, pluralPosts, postUrl } from '@/utils/posts';

export const GET: APIRoute = async () => {
  const posts = await getSortedPosts();
  const categories = groupByCategory(posts);

  const lines: string[] = [
    '---',
    'title: "All Posts - Marcin Jasion"',
    `description: "Articles on observability, Kubernetes, cloud infrastructure and AI agents for operations, grouped by topic."`,
    'canonical: https://mjasion.pl/posts/',
    '---',
    '',
    '# All Posts',
    '',
    `${posts.length} posts across ${categories.length} categories.`,
    '',
  ];

  for (const [cat, catPosts] of categories) {
    const label = categoryLabels[cat] ?? cat;
    lines.push(`## [${label}](https://mjasion.pl/posts/${cat}/) (${pluralPosts(catPosts.length)})`, '');
    for (const post of catPosts) {
      lines.push(`- ${isoDate(post.data.date)} - [${post.data.title}](${postUrl(post)})`);
    }
    lines.push('');
  }

  return markdownResponse(lines);
};

import type { APIRoute } from 'astro';
import { author, categoryLabels } from '@/data/portfolio';
import { getSortedPosts, groupByCategory, siteUrlOf } from '@/utils/posts';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = siteUrlOf(site);
  const posts = await getSortedPosts();

  const allTags = [...new Set(posts.flatMap((post) => post.data.tags))].sort();

  const postList = posts
    .map((post) => `- [${post.data.title}](${siteUrl}/posts/${post.id}/)`)
    .join('\n');

  const categoryList = groupByCategory(posts)
    .map(([cat, catPosts]) => `- ${categoryLabels[cat] ?? cat} (${catPosts.length} articles)`)
    .join('\n');

  const text = `# ${author.name}

> Personal blog of ${author.name} (Warsaw) – practical notes on observability, Kubernetes, cloud infrastructure and AI agents for operations.

## About

${author.summaryForAgents} CV: ${siteUrl}/cv/

- Website: ${siteUrl}
- GitHub: https://github.com/mjasion
- LinkedIn: https://linkedin.com/in/marcinjasion
- CV: ${siteUrl}/cv/

## Categories

${categoryList}

## Blog Posts

${postList}

## Topics

${allTags.join(', ')}

## Feed

- Atom: ${siteUrl}/index.xml
`;

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

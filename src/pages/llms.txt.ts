import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { author, yearsSince } from '@/data/portfolio';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString().replace(/\/$/, '') ?? 'https://mjasion.pl';
  const now = new Date();
  const posts = (await getCollection('posts', ({ data }) => !data.draft && (!import.meta.env.PROD || data.date <= now)))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  // Collect unique tags across all posts
  const allTags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      allTags.add(tag);
    }
  }

  // Group posts by category
  const categories = new Map<string, typeof posts>();
  for (const post of posts) {
    const cat = post.data.category;
    const existing = categories.get(cat) ?? [];
    existing.push(post);
    categories.set(cat, existing);
  }

  const postList = posts
    .map((post) => `- [${post.data.title}](${siteUrl}/posts/${post.id}/)`)
    .join('\n');

  const categoryList = Array.from(categories.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .map(([cat, catPosts]) => `- ${cat.charAt(0).toUpperCase() + cat.slice(1)} (${catPosts.length} articles)`)
    .join('\n');

  const text = `# ${author.name}

> Personal blog of ${author.name} (Warsaw) – practical notes on observability, Kubernetes, cloud infrastructure and AI agents for operations.

## About

${author.name} is an engineer based in Warsaw with ${yearsSince('2012-12')} years in tech, starting as a Java developer. He works where code meets infrastructure: diagnosing incidents, closing observability gaps and making large service landscapes (1000+ services) boring to operate. Lately he builds AI agents that speed up incident diagnosis.

- Website: ${siteUrl}
- GitHub: https://github.com/mjasion
- LinkedIn: https://linkedin.com/in/marcinjasion
- CV: ${siteUrl}/cv/

## Categories

${categoryList}

## Blog Posts

${postList}

## Topics

${Array.from(allTags).sort().join(', ')}

## Feed

- Atom: ${siteUrl}/index.xml
`;

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

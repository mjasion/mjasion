import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { author } from '@/data/portfolio';

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

  const text = `# ${author.name} - ${author.designation}

> ${author.summary}

## About

${author.name} is a ${author.designation}. This site contains technical blog posts and a professional portfolio.

- Website: ${siteUrl}
- GitHub: https://github.com/mjasion
- LinkedIn: https://linkedin.com/in/marcinjasion

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

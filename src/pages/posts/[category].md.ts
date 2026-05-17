import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { categoryLabels } from '../../data/portfolio';

export async function getStaticPaths() {
  const now = new Date();
  const posts = (await getCollection('posts', ({ data }) => !data.draft && (!import.meta.env.PROD || data.date <= now)))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const categories = new Map<string, typeof posts>();
  for (const post of posts) {
    const cat = post.data.category;
    const existing = categories.get(cat) ?? [];
    existing.push(post);
    categories.set(cat, existing);
  }

  return Array.from(categories.entries()).map(([category, catPosts]) => ({
    params: { category },
    props: { category, posts: catPosts },
  }));
}

export const GET: APIRoute = ({ props }) => {
  const { category, posts } = props as {
    category: string;
    posts: Awaited<ReturnType<typeof getCollection<'posts'>>>;
  };
  const label = categoryLabels[category] ?? category;

  const lines: string[] = [
    '---',
    `title: "${label} posts — Marcin Jasion"`,
    `description: ${JSON.stringify(`All ${label} posts by Marcin Jasion. ${posts.length} ${posts.length === 1 ? 'post' : 'posts'}.`)}`,
    `canonical: https://mjasion.pl/posts/${category}/`,
    '---',
    '',
    `# ${label}`,
    '',
    `${posts.length} ${posts.length === 1 ? 'post' : 'posts'} in this category.`,
    '',
  ];

  for (const post of posts) {
    const date = post.data.date.toISOString().slice(0, 10);
    lines.push(
      `- ${date} — [${post.data.title}](https://mjasion.pl/posts/${post.id}/) — ${post.data.description.replace(/\n/g, ' ').trim()}`,
    );
  }

  lines.push('');

  return new Response(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
};

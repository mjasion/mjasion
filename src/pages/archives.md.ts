import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const now = new Date();
  const posts = (await getCollection('posts', ({ data }) => !data.draft && (!import.meta.env.PROD || data.date <= now)))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const postsByYear = new Map<number, typeof posts>();
  for (const post of posts) {
    const year = post.data.date.getFullYear();
    const yearPosts = postsByYear.get(year) ?? [];
    yearPosts.push(post);
    postsByYear.set(year, yearPosts);
  }

  const oldestYear = Array.from(postsByYear.keys()).pop();

  const lines: string[] = [
    '---',
    'title: "Archives - Marcin Jasion"',
    `description: "All blog posts by Marcin Jasion, organized by year. ${posts.length} posts since ${oldestYear}."`,
    'canonical: https://mjasion.pl/archives/',
    '---',
    '',
    '# Archives',
    '',
    `${posts.length} posts since ${oldestYear}.`,
    '',
  ];

  for (const [year, yearPosts] of postsByYear.entries()) {
    lines.push(`## ${year} (${yearPosts.length} ${yearPosts.length === 1 ? 'post' : 'posts'})`, '');
    for (const post of yearPosts) {
      const date = post.data.date.toISOString().slice(0, 10);
      lines.push(`- ${date} - [${post.data.title}](https://mjasion.pl/posts/${post.id}/) (${post.data.category})`);
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

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const MIN_POSTS_FOR_TAG_PAGE = 5;

export async function getStaticPaths() {
  const now = new Date();
  const posts = (await getCollection('posts', ({ data }) => !data.draft && (!import.meta.env.PROD || data.date <= now)))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const tagPosts = new Map<string, typeof posts>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      const existing = tagPosts.get(tag) ?? [];
      existing.push(post);
      tagPosts.set(tag, existing);
    }
  }

  return Array.from(tagPosts.entries())
    .filter(([, ps]) => ps.length >= MIN_POSTS_FOR_TAG_PAGE)
    .map(([tag, ps]) => ({ params: { tag }, props: { tag, posts: ps } }));
}

export const GET: APIRoute = ({ props }) => {
  const { tag, posts } = props as {
    tag: string;
    posts: Awaited<ReturnType<typeof getCollection<'posts'>>>;
  };

  const lines: string[] = [
    '---',
    `title: "Posts tagged '${tag}' — Marcin Jasion"`,
    `description: ${JSON.stringify(`Articles about ${tag} by Marcin Jasion. ${posts.length} posts.`)}`,
    `canonical: https://mjasion.pl/tags/${tag}/`,
    '---',
    '',
    `# Posts tagged \`${tag}\``,
    '',
    `${posts.length} ${posts.length === 1 ? 'post' : 'posts'}.`,
    '',
  ];

  for (const post of posts) {
    const date = post.data.date.toISOString().slice(0, 10);
    lines.push(
      `- ${date} — [${post.data.title}](https://mjasion.pl/posts/${post.id}/) (${post.data.category}) — ${post.data.description.replace(/\n/g, ' ').trim()}`,
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

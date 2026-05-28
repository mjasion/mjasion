import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const now = new Date();
  const posts = await getCollection('posts', ({ data }) => !data.draft && (!import.meta.env.PROD || data.date <= now));

  return posts.map((post) => {
    const parts = post.id.split('/');
    const category = parts[0];
    const slug = parts.slice(1).join('/');
    return {
      params: { category, slug },
      props: { post },
    };
  });
}

export const GET: APIRoute = ({ props }) => {
  const { post } = props as { post: Awaited<ReturnType<typeof getCollection<'posts'>>>[number] };

  const fmDate = post.data.date.toISOString().slice(0, 10);
  const fmDateModified = post.data.dateModified
    ? post.data.dateModified.toISOString().slice(0, 10)
    : undefined;

  const frontmatterLines = [
    '---',
    `title: ${JSON.stringify(post.data.title)}`,
    `date: ${fmDate}`,
    fmDateModified ? `dateModified: ${fmDateModified}` : null,
    `category: ${post.data.category}`,
    post.data.tags.length ? `tags: [${post.data.tags.map((t) => JSON.stringify(t)).join(', ')}]` : null,
    `description: ${JSON.stringify(post.data.description)}`,
    `canonical: https://mjasion.pl/posts/${post.id}/`,
    '---',
  ].filter((line): line is string => line !== null);
  const frontmatter = frontmatterLines.join('\n') + '\n\n';

  // Strip MDX import statements so the body parses as plain markdown.
  // JSX components (e.g. <Alert>, <Video>) are left in place - agents can read them as inline tags.
  const body = post.body
    ? post.body.replace(/^import\s+[^;]+;?\s*$/gm, '').replace(/\n{3,}/g, '\n\n').trimStart()
    : '';

  const markdown = frontmatter + body;

  return new Response(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
};

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { isVisible } from '@/utils/posts';

const MIN_POSTS_FOR_TAG_PAGE = 5;

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts', isVisible);

  const tagCounts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  const sortedTags = Array.from(tagCounts.entries()).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  );

  const lines: string[] = [
    '---',
    'title: "Tags - Marcin Jasion"',
    `description: "Browse all tags on Marcin Jasion's blog. ${sortedTags.length} tags across ${posts.length} posts."`,
    'canonical: https://mjasion.pl/tags/',
    '---',
    '',
    '# Tags',
    '',
    `${sortedTags.length} tags across ${posts.length} posts. Tags with ${MIN_POSTS_FOR_TAG_PAGE}+ posts have a dedicated page.`,
    '',
  ];

  for (const [tag, count] of sortedTags) {
    const isPopular = count >= MIN_POSTS_FOR_TAG_PAGE;
    if (isPopular) {
      lines.push(`- [${tag}](https://mjasion.pl/tags/${tag}/) - ${count} posts`);
    } else {
      lines.push(`- ${tag} - ${count} ${count === 1 ? 'post' : 'posts'}`);
    }
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

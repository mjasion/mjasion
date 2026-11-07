import type { APIRoute } from 'astro';
import { getSortedPosts, markdownResponse, MIN_POSTS_FOR_TAG_PAGE, pluralPosts, tagCounts } from '@/utils/posts';

export const GET: APIRoute = async () => {
  const posts = await getSortedPosts();
  const sortedTags = tagCounts(posts);

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
    if (count >= MIN_POSTS_FOR_TAG_PAGE) {
      lines.push(`- [${tag}](https://mjasion.pl/tags/${tag}/) - ${count} posts`);
    } else {
      lines.push(`- ${tag} - ${pluralPosts(count)}`);
    }
  }

  lines.push('');

  return markdownResponse(lines);
};

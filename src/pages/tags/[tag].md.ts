import type { APIRoute, InferGetStaticPropsType } from 'astro';
import { getSortedPosts, groupByTag, isoDate, markdownResponse, MIN_POSTS_FOR_TAG_PAGE, oneLine, pluralPosts, postUrl } from '@/utils/posts';

export async function getStaticPaths() {
  return [...groupByTag(await getSortedPosts())]
    .filter(([, posts]) => posts.length >= MIN_POSTS_FOR_TAG_PAGE)
    .map(([tag, posts]) => ({ params: { tag }, props: { tag, posts } }));
}

export const GET: APIRoute = ({ props }) => {
  const { tag, posts } = props as InferGetStaticPropsType<typeof getStaticPaths>;

  const lines: string[] = [
    '---',
    `title: "Posts tagged '${tag}' - Marcin Jasion"`,
    `description: ${JSON.stringify(`Articles about ${tag} by Marcin Jasion. ${posts.length} posts.`)}`,
    `canonical: https://mjasion.pl/tags/${tag}/`,
    '---',
    '',
    `# Posts tagged \`${tag}\``,
    '',
    `${pluralPosts(posts.length)}.`,
    '',
  ];

  for (const post of posts) {
    lines.push(
      `- ${isoDate(post.data.date)} - [${post.data.title}](${postUrl(post)}) (${post.data.category}) - ${oneLine(post.data.description)}`,
    );
  }

  lines.push('');

  return markdownResponse(lines);
};

import type { APIRoute, InferGetStaticPropsType } from 'astro';
import { categoryLabels } from '../../data/portfolio';
import { getSortedPosts, groupByCategory, isoDate, markdownResponse, oneLine, pluralPosts, postUrl } from '@/utils/posts';

export async function getStaticPaths() {
  return groupByCategory(await getSortedPosts()).map(([category, posts]) => ({
    params: { category },
    props: { category, posts },
  }));
}

export const GET: APIRoute = ({ props }) => {
  const { category, posts } = props as InferGetStaticPropsType<typeof getStaticPaths>;
  const label = categoryLabels[category] ?? category;

  const lines: string[] = [
    '---',
    `title: "${label} posts - Marcin Jasion"`,
    `description: ${JSON.stringify(`All ${label} posts by Marcin Jasion. ${pluralPosts(posts.length)}.`)}`,
    `canonical: https://mjasion.pl/posts/${category}/`,
    '---',
    '',
    `# ${label}`,
    '',
    `${pluralPosts(posts.length)} in this category.`,
    '',
  ];

  for (const post of posts) {
    lines.push(`- ${isoDate(post.data.date)} - [${post.data.title}](${postUrl(post)}) - ${oneLine(post.data.description)}`);
  }

  lines.push('');

  return markdownResponse(lines);
};

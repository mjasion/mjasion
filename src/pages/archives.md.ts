import type { APIRoute } from 'astro';
import { getSortedPosts, groupBy, isoDate, markdownResponse, pluralPosts, postUrl } from '@/utils/posts';

export const GET: APIRoute = async () => {
  const posts = await getSortedPosts();
  const postsByYear = groupBy(posts, (p) => p.data.date.getUTCFullYear());
  const oldestYear = posts.at(-1)?.data.date.getUTCFullYear();

  const lines: string[] = [
    '---',
    'title: "Archives - Marcin Jasion"',
    `description: "All posts in chronological order – Kubernetes, observability, Terraform, cloud networking and AI agents, from ${oldestYear} to today."`,
    'canonical: https://mjasion.pl/archives/',
    '---',
    '',
    '# Archives',
    '',
    `${posts.length} posts since ${oldestYear}.`,
    '',
  ];

  for (const [year, yearPosts] of postsByYear) {
    lines.push(`## ${year} (${pluralPosts(yearPosts.length)})`, '');
    for (const post of yearPosts) {
      lines.push(`- ${isoDate(post.data.date)} - [${post.data.title}](${postUrl(post)}) (${post.data.category})`);
    }
    lines.push('');
  }

  return markdownResponse(lines);
};

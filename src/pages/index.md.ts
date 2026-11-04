import type { APIRoute } from 'astro';
import { author } from '../data/portfolio';
import { getSortedPosts, isoDate, markdownResponse, oneLine, postUrl } from '@/utils/posts';

export const GET: APIRoute = async () => {
  const posts = await getSortedPosts();

  const lines: string[] = [
    '---',
    `title: ${JSON.stringify(author.name)}`,
    `description: ${JSON.stringify(author.siteDescription)}`,
    'canonical: https://mjasion.pl/',
    '---',
    '',
    `# ${author.name}`,
    '',
    author.summaryForAgents,
    'CV: https://mjasion.pl/cv/',
    '',
    'Topics: observability, Kubernetes, cloud infrastructure, platform engineering, AI agents.',
    '',
    '## Links',
    '',
    '- [About](https://mjasion.pl/about/)',
    '- [Archives](https://mjasion.pl/archives/)',
    '- [Tags](https://mjasion.pl/tags/)',
    '- [RSS / Atom feed](https://mjasion.pl/index.xml)',
    '- [Sitemap](https://mjasion.pl/sitemap-index.xml)',
    '',
    '## Latest Posts',
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

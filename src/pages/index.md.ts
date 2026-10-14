import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { isVisible } from '@/utils/posts';
import { author } from '../data/portfolio';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('posts', isVisible))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const lines: string[] = [
    '---',
    `title: ${JSON.stringify(author.name)}`,
    `description: ${JSON.stringify(author.summary)}`,
    'canonical: https://mjasion.pl/',
    '---',
    '',
    `# ${author.name}`,
    '',
    `${author.designation}.`,
    '',
    author.summary,
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
    const date = post.data.date.toISOString().slice(0, 10);
    lines.push(
      `- ${date} - [${post.data.title}](https://mjasion.pl/posts/${post.id}/) (${post.data.category}) - ${post.data.description.replace(/\n/g, ' ').trim()}`,
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

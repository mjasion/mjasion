import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { author, yearsSince } from '../data/portfolio';
import { isVisible } from '@/utils/posts';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('posts', isVisible))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const lines: string[] = [
    '---',
    `title: ${JSON.stringify(author.name)}`,
    `description: ${JSON.stringify(author.siteDescription)}`,
    'canonical: https://mjasion.pl/',
    '---',
    '',
    `# ${author.name}`,
    '',
    `Senior SRE and platform engineer based in Warsaw, with ${yearsSince('2012-12')} years in tech.`,
    'Right now I help 30+ engineering teams run a system of 1000+ services at NatWest Boxed –',
    'mostly Java services in an asynchronous, Kafka-based architecture – with a focus on',
    'observability, alert quality, incident management, and end-to-end monitoring of business',
    'journeys. Outside work I build AI agents and MCP servers on Cloudflare. Previously Senior',
    'Platform Engineer at DataChain (formerly Iterative.ai): a multi-cloud ML platform on AWS',
    'and GCP, 40% lower cloud spend, SOC2.',
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

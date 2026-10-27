import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { author, yearsSince } from '@/data/portfolio';
import { isVisible } from '@/utils/posts';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString().replace(/\/$/, '') ?? 'https://mjasion.pl';
  const posts = (await getCollection('posts', isVisible))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  // Collect unique tags across all posts
  const allTags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      allTags.add(tag);
    }
  }

  // Group posts by category
  const categories = new Map<string, typeof posts>();
  for (const post of posts) {
    const cat = post.data.category;
    const existing = categories.get(cat) ?? [];
    existing.push(post);
    categories.set(cat, existing);
  }

  const postList = posts
    .map((post) => `- [${post.data.title}](${siteUrl}/posts/${post.id}/)`)
    .join('\n');

  const categoryList = Array.from(categories.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .map(([cat, catPosts]) => `- ${cat.charAt(0).toUpperCase() + cat.slice(1)} (${catPosts.length} articles)`)
    .join('\n');

  const text = `# ${author.name}

> Personal blog of ${author.name} (Warsaw) – practical notes on observability, Kubernetes, cloud infrastructure and AI agents for operations.

## About

Senior SRE and platform engineer based in Warsaw, with ${yearsSince('2012-12')} years in tech. Right now I help 30+ engineering teams run a system of 1000+ services at NatWest Boxed – mostly Java services in an asynchronous, Kafka-based architecture – with a focus on observability, alert quality, incident management, and end-to-end monitoring of business journeys. Outside work I build AI agents and MCP servers on Cloudflare. Previously Senior Platform Engineer at DataChain (formerly Iterative.ai): a multi-cloud ML platform on AWS and GCP, 40% lower cloud spend, SOC2. CV: ${siteUrl}/cv/

- Website: ${siteUrl}
- GitHub: https://github.com/mjasion
- LinkedIn: https://linkedin.com/in/marcinjasion
- CV: ${siteUrl}/cv/

## Categories

${categoryList}

## Blog Posts

${postList}

## Topics

${Array.from(allTags).sort().join(', ')}

## Feed

- Atom: ${siteUrl}/index.xml
`;

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

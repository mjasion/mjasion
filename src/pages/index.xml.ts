import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString().replace(/\/$/, '') ?? 'https://mjasion.pl';
  const now = new Date();
  const posts = (await getCollection('posts', ({ data }) => !data.draft && (!import.meta.env.PROD || data.date <= now)))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, 10);

  const lastUpdated = posts[0]?.data.date ?? new Date();

  const entries = posts
    .map((post) => {
      const url = `${siteUrl}/posts/${post.id}/`;
      const desc = post.data.description
        ? `<blockquote>${escapeXml(post.data.description)}</blockquote>`
        : '';
      return `    <entry>
      <title type="html"><![CDATA[${post.data.title}]]></title>
      <link href="${url}?utm_source=atom_feed" rel="alternate" type="text/html" />
      <id>${url}</id>
      <author>
        <name>Marcin Jasion</name>
      </author>
      <published>${post.data.date.toISOString()}</published>
      <updated>${post.data.date.toISOString()}</updated>
      <content type="html"><![CDATA[${desc}]]></content>
      ${post.data.tags.map((t) => `<category term="${t}" label="${t}" />`).join('\n      ')}
    </entry>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">
  <generator uri="https://astro.build/">Astro</generator>
  <title type="html"><![CDATA[Marcin Jasion]]></title>
  <link href="${siteUrl}/index.xml" rel="self" type="application/atom+xml" />
  <link href="${siteUrl}/" rel="alternate" type="text/html" />
  <updated>${lastUpdated.toISOString()}</updated>
  <author>
    <name>Marcin Jasion</name>
  </author>
  <id>${siteUrl}/</id>
${entries}
</feed>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' },
  });
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

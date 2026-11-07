import path from 'node:path';
import type { APIRoute, ImageMetadata, InferGetStaticPropsType } from 'astro';
import { getCollection } from 'astro:content';
import { isoDate, isVisible, markdownResponse, postParams } from '@/utils/posts';

// Co-located post images, keyed by project-root path (`/src/content/posts/...`).
// The raw body links them relatively (`./chart.svg`), which resolves to a 404 next to
// the .md URL - the build emits them under `/_astro/` with a content hash.
const images = import.meta.glob<ImageMetadata>('/src/content/posts/**/*.{png,jpg,jpeg,gif,webp,svg}', {
  eager: true,
  import: 'default',
});

export async function getStaticPaths() {
  const posts = await getCollection('posts', isVisible);

  return posts.map((post) => ({ params: postParams(post), props: { post } }));
}

export const GET: APIRoute = ({ props, site }) => {
  const { post } = props as InferGetStaticPropsType<typeof getStaticPaths>;

  const fmDate = isoDate(post.data.date);
  const fmDateModified = post.data.dateModified ? isoDate(post.data.dateModified) : undefined;

  const frontmatterLines = [
    '---',
    `title: ${JSON.stringify(post.data.title)}`,
    `date: ${fmDate}`,
    fmDateModified ? `dateModified: ${fmDateModified}` : null,
    `category: ${post.data.category}`,
    post.data.tags.length ? `tags: [${post.data.tags.map((t) => JSON.stringify(t)).join(', ')}]` : null,
    `description: ${JSON.stringify(post.data.description)}`,
    `canonical: https://mjasion.pl/posts/${post.id}/`,
    '---',
  ].filter((line): line is string => line !== null);
  const frontmatter = frontmatterLines.join('\n') + '\n\n';

  // Strip MDX import statements so the body parses as plain markdown.
  // JSX components (e.g. <Alert>, <Video>) are left in place - agents can read them as inline tags.
  const body = post.body
    ? post.body.replace(/^import\s+[^;]+;?\s*$/gm, '').replace(/\n{3,}/g, '\n\n').trimStart()
    : '';

  // Point relative markdown images at their absolute built URLs. Unknown paths are left as-is.
  const postDir = path.posix.dirname(`/${post.filePath}`);
  const bodyWithImages = body.replace(
    /(!\[[^\]]*\]\()([^)\s]+)((?:\s+"[^"]*")?\))/g,
    (match, open: string, src: string, close: string) => {
      if (/^([a-z][a-z0-9+.-]*:|\/|#)/i.test(src)) return match;
      const image = images[path.posix.join(postDir, src)];
      return image ? open + new URL(image.src, site ?? 'https://mjasion.pl').href + close : match;
    },
  );

  const markdown = frontmatter + bodyWithImages;

  return markdownResponse([markdown]);
};

import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationFocus,
} from '@shikijs/transformers';
import { satteri } from '@astrojs/markdown-satteri';

// Dev-only: make the dev server tell the browser to cache nothing, so edits to
// any source asset always show up on a normal reload instead of needing a hard
// refresh. This matters most for Astro's `/_image` endpoint, whose URLs carry no
// content hash AND that hard-sets a 1-year `Cache-Control` — so we force
// `no-store` on every response and override any cache header a handler tries to
// set (via both `setHeader` and `writeHead`). Production is unaffected: built
// assets are content-hashed, so their cache busts automatically. Trade-off:
// slightly slower full reloads locally since nothing is cached.
function noCacheInDev() {
  return {
    name: 'no-cache-in-dev',
    apply: 'serve',
    configureServer(server) {
      const noStore = 'no-store, max-age=0, must-revalidate';
      server.middlewares.use((req, res, next) => {
        if (!res.headersSent) res.setHeader('Cache-Control', noStore);
        const setHeader = res.setHeader.bind(res);
        res.setHeader = (name, value) =>
          String(name).toLowerCase() === 'cache-control'
            ? setHeader('Cache-Control', noStore)
            : setHeader(name, value);
        const writeHead = res.writeHead.bind(res);
        res.writeHead = (status, ...args) => {
          const headers = args[args.length - 1];
          if (headers && typeof headers === 'object' && !Array.isArray(headers)) {
            for (const k of Object.keys(headers)) {
              if (k.toLowerCase() === 'cache-control') delete headers[k];
            }
          }
          setHeader('Cache-Control', noStore);
          return writeHead(status, ...args);
        };
        next();
      });
    },
  };
}

// Open external links in markdown/MDX post content in a new tab (with a safe
// `rel`). Internal links (relative, or to mjasion.pl) stay in the same tab.
// Applies to .md and .mdx — MDX inherits the markdown config by default.
const externalLinksNewTab = {
  name: 'external-links-new-tab',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      const href = node.properties?.href;
      if (
        typeof href !== 'string' ||
        !/^https?:\/\//i.test(href) ||
        /^https?:\/\/(www\.)?mjasion\.pl(\/|$)/i.test(href)
      ) {
        return;
      }
      const rel = new Set(
        [node.properties.rel ?? []].flat().join(' ').split(/\s+/).filter(Boolean),
      );
      rel.add('noopener');
      rel.add('noreferrer');
      ctx.setProperty(node, 'target', '_blank');
      ctx.setProperty(node, 'rel', [...rel].join(' '));
    },
  },
};

export default defineConfig({
  site: process.env.SITE_URL || 'https://mjasion.pl',
  output: 'static',
  image: {
    // Hero images are hand-authored SVGs that <Image format="webp"> rasterizes.
    // Astro 6.3+ gates SVG rasterization in the built-in Sharp service behind
    // this flag; all SVG sources here are our own files, never user input.
    dangerouslyProcessSVG: true,
  },
  publicDir: 'static',
  build: {
    format: 'directory',
    // CSS bundle is small (~10 KiB gzipped) and shared across pages - inline to
    // eliminate the render-blocking round-trip on first paint.
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss(), noCacheInDev()],
    optimizeDeps: {
      include: ['mermaid'],
    },
  },
  integrations: [
    mdx(),
    sitemap(),
  ],
  markdown: {
    processor: satteri({ hastPlugins: [externalLinksNewTab] }),
    shikiConfig: {
      themes: {
        light: 'github-light-high-contrast',
        dark: 'github-dark',
      },
      transformers: [
        transformerNotationDiff(),
        transformerNotationHighlight(),
        transformerNotationFocus(),
      ],
    },
  },
});

import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationFocus,
} from '@shikijs/transformers';

export default defineConfig({
  site: process.env.SITE_URL || 'https://mjasion.pl',
  output: 'static',
  image: {
    service: {
      entrypoint: './src/image-service.ts',
    },
  },
  publicDir: 'static',
  build: {
    format: 'directory',
    // CSS bundle is small (~10 KiB gzipped) and shared across pages - inline to
    // eliminate the render-blocking round-trip on first paint.
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['mermaid'],
    },
  },
  integrations: [
    mdx(),
    sitemap(),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
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

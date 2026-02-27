import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://mjasion.pl',
  output: 'static',
  publicDir: 'static',
  build: {
    format: 'directory',
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['mermaid'],
    },
  },
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});

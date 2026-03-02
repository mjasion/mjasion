import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const categoryColorMap: Record<string, string> = {
  cloud: '#3b82f6',
  development: '#10b981',
  kubernetes: '#8b5cf6',
};

// Load Inter font files from @fontsource/inter (woff format, compatible with satori).
// These are read once at module load time and cached for all OG image generations.
const interRegularPath = require.resolve('@fontsource/inter/files/inter-latin-400-normal.woff');
const interBoldPath = require.resolve('@fontsource/inter/files/inter-latin-700-normal.woff');
const interRegular = readFileSync(interRegularPath);
const interBold = readFileSync(interBoldPath);

export const getStaticPaths: GetStaticPaths = async () => {
  const now = new Date();
  const posts = await getCollection('posts', ({ data }) => !data.draft && (!import.meta.env.PROD || data.date <= now));
  return posts.map((post) => ({
    params: { path: post.id },
    props: {
      title: post.data.title,
      category: post.data.category,
      date: post.data.date,
    },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { title, category, date } = props as { title: string; category: string; date: Date };
  const categoryColor = categoryColorMap[category] ?? '#6366f1';
  const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const fontRegular = interRegular;
  const fontBold = interBold;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          fontFamily: 'Inter',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: '20px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            background: categoryColor,
                            color: 'white',
                            padding: '6px 16px',
                            borderRadius: '9999px',
                            fontSize: '18px',
                            fontWeight: 700,
                          },
                          children: category,
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            color: '#94a3b8',
                            fontSize: '18px',
                          },
                          children: formattedDate,
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: title.length > 60 ? '40px' : '48px',
                      fontWeight: 700,
                      color: '#f1f5f9',
                      lineHeight: 1.2,
                      maxHeight: '300px',
                      overflow: 'hidden',
                    },
                    children: title,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: '#6366f1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '20px',
                            fontWeight: 700,
                          },
                          children: 'MJ',
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            color: '#e2e8f0',
                            fontSize: '22px',
                            fontWeight: 700,
                          },
                          children: 'Marcin Jasion',
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      color: '#64748b',
                      fontSize: '20px',
                    },
                    children: 'mjasion.pl',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: fontRegular,
          weight: 400,
          style: 'normal' as const,
        },
        {
          name: 'Inter',
          data: fontBold,
          weight: 700,
          style: 'normal' as const,
        },
      ],
    },
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};

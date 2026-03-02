import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

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

// Load profile photo as base64 data URI for the author avatar
const profilePhotoPath = resolve(process.cwd(), 'src/assets/images/mjasion.jpg');
const profilePhotoBase64 = `data:image/jpeg;base64,${readFileSync(profilePhotoPath).toString('base64')}`;

function loadHeroImage(postId: string): string | null {
  try {
    const heroPath = resolve(process.cwd(), `src/content/posts/${postId}/hero.svg`);
    if (!existsSync(heroPath)) return null;

    const svgContent = readFileSync(heroPath, 'utf-8');
    const resvg = new Resvg(svgContent, {
      fitTo: { mode: 'width', value: 600 },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();
    const base64 = Buffer.from(pngBuffer).toString('base64');
    return `data:image/png;base64,${base64}`;
  } catch {
    return null;
  }
}

function buildTextOnlyLayout(
  title: string,
  category: string,
  categoryColor: string,
  formattedDate: string,
) {
  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        fontFamily: 'Inter',
      },
      children: [
        // Left color stripe
        {
          type: 'div',
          props: {
            style: {
              width: '300px',
              height: '100%',
              background: categoryColor,
              flexShrink: 0,
            },
          },
        },
        // Right content area
        {
          type: 'div',
          props: {
            style: {
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '50px 50px 50px 50px',
              background: '#ffffff',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column', gap: '20px' },
                  children: [
                    buildCategoryBadge(category, categoryColor, formattedDate),
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: title.length > 60 ? '40px' : '48px',
                          fontWeight: 700,
                          color: '#0f172a',
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
              buildBottomBar(),
            ],
          },
        },
      ],
    },
  };
}

function buildHeroLayout(
  heroDataUri: string,
  title: string,
  category: string,
  categoryColor: string,
  formattedDate: string,
) {
  const titleFontSize = title.length > 60 ? 36 : title.length > 40 ? 40 : 44;

  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        fontFamily: 'Inter',
      },
      children: [
        // Left color stripe with hero image centered
        {
          type: 'div',
          props: {
            style: {
              width: '420px',
              height: '100%',
              background: categoryColor,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
            },
            children: [
              {
                type: 'img',
                props: {
                  src: heroDataUri,
                  style: {
                    width: '340px',
                    height: '340px',
                    objectFit: 'contain',
                    borderRadius: '20px',
                  },
                },
              },
            ],
          },
        },
        // Right content area
        {
          type: 'div',
          props: {
            style: {
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '30px',
              padding: '50px',
              background: '#ffffff',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column', gap: '18px' },
                  children: [
                    buildCategoryBadge(category, categoryColor, formattedDate),
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: `${titleFontSize}px`,
                          fontWeight: 700,
                          color: '#0f172a',
                          lineHeight: 1.2,
                          maxHeight: '280px',
                          overflow: 'hidden',
                        },
                        children: title,
                      },
                    },
                  ],
                },
              },
              buildBottomBar(),
            ],
          },
        },
      ],
    },
  };
}

function buildCategoryBadge(category: string, categoryColor: string, formattedDate: string) {
  return {
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
              color: '#64748b',
              fontSize: '18px',
            },
            children: formattedDate,
          },
        },
      ],
    },
  };
}

function buildBottomBar() {
  return {
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
                type: 'img',
                props: {
                  src: profilePhotoBase64,
                  style: {
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                  },
                },
              },
              {
                type: 'span',
                props: {
                  style: {
                    color: '#1e293b',
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
              color: '#94a3b8',
              fontSize: '20px',
            },
            children: 'mjasion.pl',
          },
        },
      ],
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const now = new Date();
  const posts = await getCollection('posts', ({ data }) => !data.draft && (!import.meta.env.PROD || data.date <= now));
  return posts.map((post) => ({
    params: { path: post.id },
    props: {
      title: post.data.title,
      category: post.data.category,
      date: post.data.date,
      hasHero: !!post.data.hero,
      postId: post.id,
    },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { title, category, date, hasHero, postId } = props as {
    title: string;
    category: string;
    date: Date;
    hasHero: boolean;
    postId: string;
  };
  const categoryColor = categoryColorMap[category] ?? '#6366f1';
  const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const sanitizedTitle = title.replace(/\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu, '').trim();

  const heroDataUri = hasHero ? loadHeroImage(postId) : null;

  const layout = heroDataUri
    ? buildHeroLayout(heroDataUri, sanitizedTitle, category, categoryColor, formattedDate)
    : buildTextOnlyLayout(sanitizedTitle, category, categoryColor, formattedDate);

  const svg = await satori(layout, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Inter',
        data: interRegular,
        weight: 400,
        style: 'normal' as const,
      },
      {
        name: 'Inter',
        data: interBold,
        weight: 700,
        style: 'normal' as const,
      },
    ],
  });

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

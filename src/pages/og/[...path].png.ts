import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { isVisible } from '@/utils/posts';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';

const require = createRequire(import.meta.url);

// Content-hash disk cache. Generating an OG image (hero SVG -> PNG via Resvg,
// then satori -> SVG -> PNG via Resvg again) costs ~0.5-3s each and is the bulk
// of build time. The output is a pure function of the rendering inputs, so we
// cache by hash and skip all rendering on a hit. Bump CACHE_VERSION whenever the
// layout, fonts, or profile photo change (inputs not captured by the per-post hash).
const CACHE_VERSION = '1';
// Lives under Astro's cache dir (node_modules/.astro) so it persists locally and
// rides along with the same cache Astro uses for optimized images.
const OG_CACHE_DIR = resolve(process.cwd(), 'node_modules/.astro/og-cache');
try {
  mkdirSync(OG_CACHE_DIR, { recursive: true });
} catch {
  // Read-only FS (some CI sandboxes) — caching is best-effort, generation still works.
}

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

function readHeroSvg(postId: string): string | null {
  const heroPath = resolve(process.cwd(), `src/content/posts/${postId}/hero.svg`);
  if (!existsSync(heroPath)) return null;
  try {
    return readFileSync(heroPath, 'utf-8');
  } catch {
    return null;
  }
}

function renderHeroToDataUri(svgContent: string): string | null {
  try {
    const resvg = new Resvg(svgContent, {
      fitTo: { mode: 'width', value: 800 },
    });
    const pngBuffer = resvg.render().asPng();
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
) {
  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        fontFamily: 'Inter',
        background: `linear-gradient(to right, ${categoryColor} 0%, ${categoryColor} 10%, white 30%)`,
      },
      children: [
        // Left color area (no badge)
        {
          type: 'div',
          props: {
            style: {
              width: '300px',
              height: '100%',
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
              padding: '50px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  },
                  children: [
                    buildCategoryBadgeDark(category, categoryColor),
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: title.length > 60 ? '56px' : '72px',
                          fontWeight: 700,
                          color: '#0f172a',
                          lineHeight: 1.2,
                          maxHeight: '400px',
                          overflow: 'hidden',
                        },
                        children: title,
                      },
                    },
                  ],
                },
              },
              buildBottomBar(categoryColor),
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
) {
  const titleFontSize = title.length > 60 ? 56 : 72;

  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        fontFamily: 'Inter',
        background: `linear-gradient(to right, ${categoryColor} 0%, ${categoryColor} 10%, white 35%)`,
      },
      children: [
        // Left area with hero image only
        {
          type: 'div',
          props: {
            style: {
              width: '480px',
              height: '100%',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            },
            children: [
              {
                type: 'img',
                props: {
                  src: heroDataUri,
                  style: {
                    width: '550px',
                    height: '550px',
                    objectFit: 'contain',
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
              gap: '24px',
              padding: '50px',
            },
            children: [
              buildCategoryBadgeDark(category, categoryColor),
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: `${titleFontSize}px`,
                    fontWeight: 700,
                    color: '#0f172a',
                    lineHeight: 1.2,
                    maxHeight: '380px',
                    overflow: 'hidden',
                  },
                  children: title,
                },
              },
              buildBottomBar(categoryColor),
            ],
          },
        },
      ],
    },
  };
}

function buildCategoryBadgeDark(category: string, categoryColor: string) {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
      },
      children: [
        {
          type: 'span',
          props: {
            style: {
              background: `${categoryColor}20`,
              color: categoryColor,
              padding: '8px 20px',
              borderRadius: '9999px',
              fontSize: '20px',
              fontWeight: 700,
            },
            children: category,
          },
        },
      ],
    },
  };
}

function buildBottomBar(categoryColor: string) {
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
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                  },
                },
              },
              {
                type: 'span',
                props: {
                  style: {
                    color: '#1e293b',
                    fontSize: '26px',
                    fontWeight: 700,
                  },
                  children: 'Marcin Jasion',
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
              gap: '8px',
              background: `${categoryColor}15`,
              border: `2px solid ${categoryColor}40`,
              padding: '10px 20px',
              borderRadius: '9999px',
            },
            children: [
              {
                type: 'span',
                props: {
                  style: {
                    color: categoryColor,
                    fontSize: '18px',
                    fontWeight: 600,
                  },
                  children: 'Read on mjasion.pl ->',
                },
              },
            ],
          },
        },
      ],
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('posts', isVisible);
  return posts.map((post) => ({
    params: { path: post.id },
    props: {
      title: post.data.title,
      category: post.data.category,
      hasHero: !!post.data.hero,
      postId: post.id,
    },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { title, category, hasHero, postId } = props as {
    title: string;
    category: string;
    hasHero: boolean;
    postId: string;
  };
  const categoryColor = categoryColorMap[category] ?? '#6366f1';
  const sanitizedTitle = title.replace(/\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu, '').trim();

  const heroSvg = hasHero ? readHeroSvg(postId) : null;

  // Cache key covers every per-post input that affects the rendered pixels.
  // Profile photo and fonts are global — invalidate those via CACHE_VERSION.
  const cacheKey = createHash('sha256')
    .update(`${CACHE_VERSION}\0${sanitizedTitle}\0${category}\0${heroSvg ?? ''}`)
    .digest('hex');
  const cachePath = join(OG_CACHE_DIR, `${cacheKey}.png`);

  if (existsSync(cachePath)) {
    try {
      return pngResponse(readFileSync(cachePath));
    } catch {
      // Corrupt/unreadable cache entry — fall through and regenerate.
    }
  }

  const heroDataUri = heroSvg ? renderHeroToDataUri(heroSvg) : null;

  const layout = heroDataUri
    ? buildHeroLayout(heroDataUri, sanitizedTitle, category, categoryColor)
    : buildTextOnlyLayout(sanitizedTitle, category, categoryColor);

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
  const pngBuffer = Buffer.from(resvg.render().asPng());

  try {
    writeFileSync(cachePath, pngBuffer);
  } catch {
    // Best-effort cache write; never fail the build over it.
  }

  return pngResponse(pngBuffer);
};

function pngResponse(pngBuffer: Buffer): Response {
  return new Response(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

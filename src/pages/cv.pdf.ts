import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { author, experiences, presentations } from '../data/portfolio';
import {
  education,
  languages,
  publications,
  skillGroups,
  credentials,
  emphasizeMetrics,
  parseInlineLinks,
} from '../data/cv';

// Build-time PDF twin of the /cv/ page: same data (portfolio.ts + cv.ts), same
// print design (A4, 14mm margins, Inter, the print:* sizes and gray palette from
// cv.astro). pdfmake is pure JS, so this renders identically on any build host.
// All sizes below are in pt; the page's print sizes are px * 0.75.
// lineHeight caveat: pdfmake multiplies the font's NATURAL line height (~1.21
// for Inter), while CSS line-height multiplies font-size - so the values below
// are the page's effective CSS multipliers divided by 1.21. Calibrated against
// a Chrome print-to-PDF of /cv/ (same pagination: 2 pages, page 1 ends after
// Codility).

const require = createRequire(import.meta.url);

// Tailwind grays used by the CV's print view.
const GRAY_900 = '#111827';
const GRAY_700 = '#374151';
const GRAY_500 = '#6B7280';

// CV palette - the --cv-* tokens in cv.astro (light values).
const BAND_BG = '#0F172A';
const BAND_TEXT = '#FFFFFF';
const BAND_ROLE = '#A5B4FC';
const BAND_MUTED = '#CBD5E1';
const HEADING = '#0F172A';
const ACCENT = '#4F46E5';
const CHIP_BG = '#EEF2FF';
const CHIP_TEXT = '#3730A3';
const MUTED = '#64748B';

// A4 (595.28pt) minus 14mm (~40pt) margins on both sides.
const PAGE_MARGIN = 40;
const CONTENT_WIDTH = 515;

// Skill chips - page: 11px medium, 1px 7px padding, 4px radius, 14px line,
// gap-1 between chips and rows; labels in a 120px print column, gap-3.
const CHIP_FONT_SIZE = 8.25;
const CHIP_PAD_X = 5.25;
const CHIP_PAD_Y = 0.75;
const CHIP_HEIGHT = 10.5 + 2 * CHIP_PAD_Y;
const CHIP_GAP = 3;
const SKILL_LABEL_WIDTH = 90;
const SKILL_LABEL_GAP = 9;

// pdfmake can't flow boxes inline, so the chips are wrapped into rows by hand.
// Their text is measured with fontkit - the font engine pdfkit renders with,
// reached through pdfmake's own dependency tree - from the same Inter file.
interface Font {
  unitsPerEm: number;
  layout: (text: string) => { advanceWidth: number };
}
const fontkit = createRequire(createRequire(require.resolve('pdfmake')).resolve('pdfkit'))(
  'fontkit',
) as { create: (buffer: Buffer) => Font };
const chipFont = fontkit.create(
  readFileSync(require.resolve('@fontsource/inter/files/inter-latin-500-normal.woff')),
);

interface PdfMakeServer {
  fonts: Record<string, { normal: string; bold: string; italics: string; bolditalics: string }>;
  virtualfs: { writeFileSync: (name: string, content: Buffer) => void };
  setUrlAccessPolicy: (callback: (url: string) => boolean) => void;
  setLocalAccessPolicy: (callback: (path: string) => boolean) => void;
  createPdf: (docDefinition: unknown) => { getBuffer: () => Promise<Buffer> };
}

type Content = Record<string, unknown>;

async function loadPdfMake(): Promise<PdfMakeServer> {
  // pdfmake 0.3.x: use the high-level singleton, which wires Printer +
  // VirtualFileSystem + URLResolver internally (constructing PdfPrinter
  // directly crashes in resolveUrls). Register Inter from @fontsource/inter -
  // the first font of the site's --font-sans stack - so the PDF matches the
  // page's intended typography. Weights: pdfmake families hold two weights
  // each, so 500/600 live in a second "InterMedium" family.
  const pdfmakeMod: unknown = await import('pdfmake');
  const pdfmake =
    (pdfmakeMod as { default?: PdfMakeServer }).default ?? (pdfmakeMod as PdfMakeServer);

  // Everything renders from the virtual FS; deny external URLs and local paths
  // (also silences pdfmake's per-build "No ... access policy defined" warnings).
  pdfmake.setUrlAccessPolicy(() => false);
  pdfmake.setLocalAccessPolicy(() => false);

  const weights = [400, 500, 600, 700] as const;
  for (const weight of weights) {
    const file = require.resolve(`@fontsource/inter/files/inter-latin-${weight}-normal.woff`);
    pdfmake.virtualfs.writeFileSync(`Inter-${weight}.woff`, readFileSync(file));
  }
  const italic = require.resolve('@fontsource/inter/files/inter-latin-400-italic.woff');
  pdfmake.virtualfs.writeFileSync('Inter-400-italic.woff', readFileSync(italic));

  pdfmake.fonts = {
    // normal = 400, bold = 700 (page: font-bold)
    Inter: {
      normal: 'Inter-400.woff',
      bold: 'Inter-700.woff',
      italics: 'Inter-400-italic.woff',
      bolditalics: 'Inter-400-italic.woff',
    },
    // normal = 500 (font-medium), bold = 600 (font-semibold); italics unused
    InterMedium: {
      normal: 'Inter-500.woff',
      bold: 'Inter-600.woff',
      italics: 'Inter-400-italic.woff',
      bolditalics: 'Inter-400-italic.woff',
    },
  };

  return pdfmake;
}

// Runs for a string that may embed inline HTML anchors (kept clickable) and
// <strong> (bold, same colour).
function textRuns(html: string): Array<string | Content> {
  return parseInlineLinks(html).map((run) =>
    run.href ? { text: run.text, link: run.href } : run.strong ? { text: run.text, bold: true } : run.text,
  );
}

// Section heading - page: text-base -> print:text-xs, semibold, uppercase,
// tracking-wider, dark, after a 16x3px rounded accent bar (gap 8px); section
// print:mt-5.
function sectionHeading(title: string): Content {
  return {
    columns: [
      { width: 12, canvas: [{ type: 'rect', x: 0, y: 4.3, w: 12, h: 2.25, r: 1.1, color: ACCENT }] },
      {
        width: '*',
        text: title.toUpperCase(),
        font: 'InterMedium',
        bold: true,
        fontSize: 9,
        color: HEADING,
        characterSpacing: 0.45,
      },
    ],
    columnGap: 6,
    margin: [0, 15, 0, 0],
  };
}

// One skill chip: a rounded background rect with the label pulled up over it.
function chip(item: string, width: number): Content {
  return {
    width,
    stack: [
      { canvas: [{ type: 'rect', x: 0, y: 0, w: width, h: CHIP_HEIGHT, r: 3, color: CHIP_BG }] },
      {
        text: item,
        font: 'InterMedium',
        fontSize: CHIP_FONT_SIZE,
        color: CHIP_TEXT,
        lineHeight: 1,
        margin: [CHIP_PAD_X, CHIP_PAD_Y - CHIP_HEIGHT + 0.2, 0, 0],
      },
    ],
  };
}

// Chips wrapped into rows that fit maxWidth (page: flex-wrap gap-1).
function chipRows(items: string[], maxWidth: number): Content[] {
  const rows: Array<Array<{ item: string; width: number }>> = [[]];
  let x = 0;
  for (const item of items) {
    const textWidth = (chipFont.layout(item).advanceWidth / chipFont.unitsPerEm) * CHIP_FONT_SIZE;
    const width = Math.ceil(textWidth + 2 * CHIP_PAD_X);
    if (x > 0 && x + width > maxWidth) {
      rows.push([]);
      x = 0;
    }
    rows[rows.length - 1].push({ item, width });
    x += width + CHIP_GAP;
  }
  return rows.map((row, i) => ({
    columns: row.map((c) => chip(c.item, c.width)),
    columnGap: CHIP_GAP,
    margin: [0, i === 0 ? 0 : CHIP_GAP, 0, 0],
  }));
}

// left/right baseline row (page: flex justify-between).
function splitRow(left: Content, right: Content, topMargin: number): Content {
  return {
    columns: [
      { ...left, width: '*' },
      { ...right, width: 'auto', alignment: 'right' },
    ],
    columnGap: 9,
    margin: [0, topMargin, 0, 0],
  };
}

function buildDocDefinition(): Record<string, unknown> {
  const content: Content[] = [];

  // Header band - a one-cell table pulled out over the page margins so its
  // fill bleeds to the top and side edges of page 1. Inside: name
  // (print:text-2xl bold tracking-tight, white), role (print:text-base),
  // contact row (print:text-xs, gap-x-4). Compact padding (~28px top, ~20px
  // bottom) so the band doesn't cost the 2-page fit.
  content.push({
    table: {
      widths: ['*'],
      body: [
        [
          {
            fillColor: BAND_BG,
            stack: [
              { text: author.name, fontSize: 18, bold: true, color: BAND_TEXT, characterSpacing: -0.45 },
              { text: author.role, fontSize: 12, color: BAND_ROLE, margin: [0, 3, 0, 0] },
              {
                columns: [
                  { text: 'Warsaw, Poland', width: 'auto' },
                  { text: author.email, link: `mailto:${author.email}`, width: 'auto' },
                  { text: 'mjasion.pl', link: 'https://mjasion.pl', width: 'auto' },
                  {
                    text: 'linkedin.com/in/marcinjasion',
                    link: 'https://www.linkedin.com/in/marcinjasion',
                    width: 'auto',
                  },
                  { text: 'github.com/mjasion', link: 'https://www.github.com/mjasion', width: 'auto' },
                ],
                columnGap: 12,
                fontSize: 9,
                color: BAND_MUTED,
                margin: [0, 9, 0, 0],
              },
            ],
          },
        ],
      ],
    },
    layout: {
      hLineWidth: () => 0,
      vLineWidth: () => 0,
      paddingLeft: () => PAGE_MARGIN,
      paddingRight: () => PAGE_MARGIN,
      paddingTop: () => 21,
      paddingBottom: () => 15,
    },
    margin: [-PAGE_MARGIN, -PAGE_MARGIN, -PAGE_MARGIN, 0],
  });

  // Summary - print:text-[11.5px] gray-700 leading-relaxed, print:mt-4.
  content.push({
    text: author.summary,
    fontSize: 8.6,
    color: GRAY_700,
    lineHeight: 1.34,
    margin: [0, 12, 0, 0],
  });

  // Experience - entries print:space-y-3, each break-inside-avoid.
  content.push(sectionHeading('Experience'));
  for (const exp of experiences) {
    content.push({
      unbreakable: true,
      margin: [0, 9, 0, 0],
      stack: [
        // company (print:text-sm semibold) <-> location (text-xs gray-500)
        splitRow(
          {
            text: exp.company,
            link: exp.url,
            font: 'InterMedium',
            bold: true,
            fontSize: 10.5,
            color: GRAY_900,
          },
          { text: exp.location, fontSize: 9, color: MUTED },
          0,
        ),
        // overview - print:text-[10.5px] muted leading-snug, mt-0.5
        {
          text: exp.overview,
          fontSize: 7.9,
          color: MUTED,
          lineHeight: 1.15,
          margin: [0, 1.5, 0, 0],
        },
        ...exp.positions.flatMap((pos): Content[] => [
          // designation (print:text-[12px] medium, accent) <-> dates (text-xs muted), print:mt-1.5
          splitRow(
            { text: pos.designation, font: 'InterMedium', fontSize: 9, color: ACCENT },
            { text: `${pos.start} – ${pos.end ?? 'Present'}`, fontSize: 9, color: MUTED },
            4.5,
          ),
          // bullets - print:text-[10.5px] gray-700, accent markers, metrics bold, mt-1 + space-y-0.5
          {
            stack: pos.responsibilities.map((r) => ({
              columns: [
                { text: '•', width: 8, fontSize: 7.9, color: ACCENT },
                {
                  text: textRuns(emphasizeMetrics(exp.company, r)),
                  fontSize: 7.9,
                  color: GRAY_700,
                  lineHeight: 1.1,
                  width: '*',
                },
              ],
              margin: [0, 1.5, 0, 0],
            })),
            margin: [0, 1.5, 0, 0],
          },
        ]),
      ],
    });
  }

  // Skills - label column (medium gray-900) + wrapped chips, space-y-1.
  const chipsWidth = CONTENT_WIDTH - SKILL_LABEL_WIDTH - SKILL_LABEL_GAP;
  content.push({
    unbreakable: true,
    stack: [
      sectionHeading('Skills'),
      ...skillGroups.map((group) => ({
        columns: [
          {
            text: group.label,
            width: SKILL_LABEL_WIDTH,
            font: 'InterMedium',
            fontSize: 7.9,
            color: GRAY_900,
            margin: [0, 1.2, 0, 0],
          },
          { width: '*', stack: chipRows(group.items, chipsWidth) },
        ],
        columnGap: SKILL_LABEL_GAP,
        margin: [0, 3, 0, 0],
      })),
    ],
  });

  // Certifications & Training - name (medium, link) - org, timeline right; space-y-1.
  content.push({
    unbreakable: true,
    stack: [
      sectionHeading('Certifications & Training'),
      ...credentials.map((cert) =>
        splitRow(
          {
            text: [
              { text: cert.name, font: 'InterMedium', link: cert.url },
              { text: ` – ${cert.organization}`, color: GRAY_500 },
            ],
            fontSize: 7.9,
            color: GRAY_700,
          },
          { text: cert.timeline, fontSize: 7.9, color: GRAY_500 },
          3,
        ),
      ),
    ],
  });

  // Talks & Publications.
  content.push({
    unbreakable: true,
    stack: [
      sectionHeading('Talks & Publications'),
      ...presentations.map((talk) =>
        splitRow(
          {
            text: [
              { text: talk.name, font: 'InterMedium' },
              { text: ` – ${talk.meetup}`, color: GRAY_500 },
            ],
            fontSize: 7.9,
            color: GRAY_700,
          },
          { text: talk.date, fontSize: 7.9, color: GRAY_500 },
          3,
        ),
      ),
      ...publications.map((pub) =>
        splitRow(
          {
            text: [
              { text: pub.title, font: 'InterMedium', link: pub.url },
              { text: ' – open-source contribution', color: GRAY_500 },
            ],
            fontSize: 7.9,
            color: GRAY_700,
          },
          { text: pub.year, fontSize: 7.9, color: GRAY_500 },
          3,
        ),
      ),
    ],
  });

  // Education & Languages - side by side (print:grid-cols-2, gap-6).
  content.push({
    unbreakable: true,
    margin: [0, 15, 0, 0],
    columns: [
      {
        stack: [
          { ...sectionHeading('Education'), margin: [0, 0, 0, 0] },
          ...education.map((ed) => ({
            stack: [
              { text: ed.degree, font: 'InterMedium', fontSize: 7.9, color: GRAY_700 },
              { text: `${ed.school} · ${ed.years}`, fontSize: 7.9, color: GRAY_500 },
            ],
            margin: [0, 3, 0, 0],
          })),
        ],
      },
      {
        stack: [
          { ...sectionHeading('Languages'), margin: [0, 0, 0, 0] },
          ...languages.map((lang) => ({
            text: [
              { text: lang.name, font: 'InterMedium' },
              { text: ` – ${lang.level}`, color: GRAY_500 },
            ],
            fontSize: 7.9,
            color: GRAY_700,
            margin: [0, 3, 0, 0],
          })),
        ],
      },
    ],
    columnGap: 18,
  });

  return {
    content,
    defaultStyle: { font: 'Inter', fontSize: 9, color: GRAY_700, lineHeight: 1.1 },
    pageSize: 'A4',
    pageMargins: [PAGE_MARGIN, PAGE_MARGIN, PAGE_MARGIN, PAGE_MARGIN],
    info: {
      title: `CV – ${author.name}`,
      author: author.name,
      subject: author.role,
      creator: 'mjasion.pl',
    },
  };
}

export const GET: APIRoute = async () => {
  const pdfmake = await loadPdfMake();
  const buffer = await pdfmake.createPdf(buildDocDefinition()).getBuffer();
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
};

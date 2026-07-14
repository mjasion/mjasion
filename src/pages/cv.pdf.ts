import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { author, skills, experiences, certifications, presentations } from '../data/portfolio';
import {
  education,
  languages,
  publications,
  additionalSkills,
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
const GRAY_600 = '#4B5563';
const GRAY_500 = '#6B7280';
const GRAY_200 = '#E5E7EB';
const GRAY_100 = '#F3F4F6';
const GRAY_800 = '#1F2937';

// A4 (595.28pt) minus 14mm (~40pt) margins on both sides.
const CONTENT_WIDTH = 515;

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

// Runs for a string that may embed inline HTML anchors (kept clickable).
function textRuns(html: string): Array<string | Content> {
  return parseInlineLinks(html).map((run) =>
    run.href ? { text: run.text, link: run.href } : run.text,
  );
}

// Section heading - page: text-base -> print:text-xs, semibold, uppercase,
// tracking-wide, gray-500, section print:mt-5.
function sectionHeading(title: string): Content {
  return {
    text: title.toUpperCase(),
    font: 'InterMedium',
    bold: true,
    fontSize: 9,
    color: GRAY_500,
    characterSpacing: 0.25,
    margin: [0, 15, 0, 0],
  };
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

  // Header - name (print:text-2xl bold tracking-tight), designation
  // (print:text-base gray-600), contact row (print:text-xs gray-600, gap-x-4),
  // bottom border (gray-200, print:pb-3).
  content.push(
    { text: author.name, fontSize: 18, bold: true, color: GRAY_900, characterSpacing: -0.45 },
    { text: author.designation, fontSize: 12, color: GRAY_600, margin: [0, 3, 0, 0] },
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
      color: GRAY_600,
      margin: [0, 9, 0, 0],
    },
    {
      canvas: [
        { type: 'line', x1: 0, y1: 0, x2: CONTENT_WIDTH, y2: 0, lineWidth: 0.75, lineColor: GRAY_200 },
      ],
      margin: [0, 9, 0, 0],
    },
  );

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
          { text: exp.location, fontSize: 9, color: GRAY_500 },
          0,
        ),
        // overview - print:text-[10.5px] gray-600 leading-snug, mt-0.5
        {
          text: exp.overview,
          fontSize: 7.9,
          color: GRAY_600,
          lineHeight: 1.15,
          margin: [0, 1.5, 0, 0],
        },
        ...exp.positions.flatMap((pos): Content[] => [
          // designation (print:text-[12px] medium) <-> dates (text-xs gray-500), print:mt-1.5
          splitRow(
            { text: pos.designation, font: 'InterMedium', fontSize: 9, color: GRAY_900 },
            { text: `${pos.start} - ${pos.end ?? 'Present'}`, fontSize: 9, color: GRAY_500 },
            4.5,
          ),
          // bullets - print:text-[10.5px] gray-700, dot print:bg-gray-600, mt-1 + space-y-0.5
          {
            stack: pos.responsibilities.map((r) => ({
              columns: [
                { text: '•', width: 8, fontSize: 7.9, color: GRAY_600 },
                { text: textRuns(r), fontSize: 7.9, color: GRAY_700, lineHeight: 1.1, width: '*' },
              ],
              margin: [0, 1.5, 0, 0],
            })),
            margin: [0, 1.5, 0, 0],
          },
        ]),
      ],
    });
  }

  // Skills - chip list (bg-gray-100, text gray-800, print:text-[10.5px]), mt-2.
  const chipNames = [...skills.map((s) => s.name), ...additionalSkills];
  content.push({
    unbreakable: true,
    stack: [
      sectionHeading('Skills'),
      {
        // NBSP padding keeps each chip unbroken and extends its background sideways.
        text: chipNames.flatMap((name, i) => [
          ...(i > 0 ? ['   '] : []),
          { text: ` ${name.replace(/ /g, ' ')} `, background: GRAY_100, color: GRAY_800 },
        ]),
        fontSize: 7.9,
        lineHeight: 1.8,
        margin: [0, 6, 0, 0],
      },
    ],
  });

  // Certifications - name (medium, link) - org, timeline right; space-y-1.
  content.push({
    unbreakable: true,
    stack: [
      sectionHeading('Certifications'),
      ...certifications.map((cert) =>
        splitRow(
          {
            text: [
              { text: cert.name, font: 'InterMedium', link: cert.certificateUrl },
              { text: ` - ${cert.organization}`, color: GRAY_500 },
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
              { text: ` - ${talk.meetup}`, color: GRAY_500 },
            ],
            fontSize: 7.9,
            color: GRAY_700,
          },
          { text: talk.date, fontSize: 7.9, color: GRAY_500 },
          3,
        ),
      ),
      ...publications.map((pub) => ({
        text: [
          { text: pub.title, font: 'InterMedium', link: pub.url },
          { text: ' - open-source contribution', color: GRAY_500 },
        ],
        fontSize: 7.9,
        color: GRAY_700,
        margin: [0, 3, 0, 0],
      })),
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
              { text: ` - ${lang.level}`, color: GRAY_500 },
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
    pageMargins: [40, 40, 40, 40],
    info: {
      title: `CV - ${author.name}`,
      author: author.name,
      subject: author.designation,
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

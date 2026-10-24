// CV-only data and helpers shared by the three CV representations:
// /cv/ (page), /cv.md (markdown endpoint), /cv.pdf (PDF endpoint).
// Portfolio-wide data (author, skills, experiences, ...) stays in portfolio.ts.
import { certifications, trainings, srePractices } from './portfolio';

// The CV lists certifications and training courses together in one section;
// /about keeps them as separate sections.
export const credentials = [
  ...certifications.map((cert) => ({
    name: cert.name,
    url: cert.certificateUrl,
    organization: cert.organization,
    timeline: cert.expired ? `${cert.timeline} (expired)` : cert.timeline,
  })),
  ...trainings.map((course) => ({
    name: course.name,
    url: course.url,
    organization: course.organization,
    timeline: course.timeline,
  })),
];

export const education = [
  {
    school: 'Warsaw University of Technology',
    degree: 'M.Sc. in Engineering, Computer Science',
    years: '2013 – 2016',
  },
  {
    school: 'Warsaw University of Technology',
    degree: "Engineer's degree, Computer Science",
    years: '2009 – 2013',
  },
];

export const languages = [
  { name: 'Polish', level: 'Native' },
  { name: 'English', level: 'Full professional' },
];

export const publications = [
  {
    title: 'DNS query metrics plugin for Telegraf',
    year: '2016',
    url: 'https://github.com/influxdata/telegraf/pull/694',
  },
];

// The CV lists skills as labelled lines rather than the /about cards, so it can
// name tools without a card there (Helm, GitHub Actions) and add context.
export const skillGroups = [
  {
    label: 'Containers & GitOps',
    items: ['Kubernetes', 'Helm', 'Argo CD', 'Argo Rollouts', 'Kyverno', 'Istio'],
  },
  { label: 'Cloud', items: ['AWS', 'GCP', 'Cloudflare'] },
  { label: 'Observability', items: ['Datadog', 'Prometheus', 'Grafana'] },
  { label: 'SRE practices', items: srePractices.map((practice) => practice.name) },
  { label: 'Programming', items: ['Go', 'TypeScript', 'Java'] },
  { label: 'AI & tools', items: ['Claude (Claude Code, AI agents)', 'GitHub Actions'] },
];

export interface InlineRun {
  text: string;
  href?: string;
}

// Some portfolio strings embed inline HTML anchors (rendered with set:html on
// the pages). Split such a string into plain-text runs, keeping each anchor's
// target so markdown/PDF consumers can emit real links. Non-anchor tags are
// stripped; the basic HTML entities are decoded.
export function parseInlineLinks(html: string): InlineRun[] {
  const runs: InlineRun[] = [];
  const anchor = /<a\s[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi;
  let last = 0;
  for (const match of html.matchAll(anchor)) {
    if (match.index > last) runs.push({ text: cleanFragment(html.slice(last, match.index)) });
    runs.push({ text: cleanFragment(match[2]), href: match[1] });
    last = match.index + match[0].length;
  }
  if (last < html.length) runs.push({ text: cleanFragment(html.slice(last)) });
  return runs.filter((run) => run.text.length > 0);
}

function cleanFragment(fragment: string): string {
  return fragment
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

export function inlineRunsToMarkdown(html: string): string {
  return parseInlineLinks(html)
    .map((run) => (run.href ? `[${run.text}](${run.href})` : run.text))
    .join('');
}

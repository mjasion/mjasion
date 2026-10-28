// CV-only data and helpers shared by the three CV representations:
// /cv/ (page), /cv.md (markdown endpoint), /cv.pdf (PDF endpoint).
// Portfolio-wide data (author, skills, experiences, ...) stays in portfolio.ts.
import { certifications, trainings } from './portfolio';

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

// The CV lists skills as labelled lines (in the /about card order) rather than
// the /about cards, so it can name tools without a card there (Helm, GitHub
// Actions) and add context.
export const skillGroups = [
  { label: 'Cloud', items: ['AWS', 'GCP', 'Cloudflare'] },
  {
    label: 'Containers & GitOps',
    items: ['Kubernetes', 'Helm', 'Argo CD', 'Istio'],
  },
  { label: 'Observability', items: ['Datadog', 'Prometheus', 'Grafana'] },
  { label: 'Programming & AI', items: ['Go', 'TypeScript', 'Java', 'Claude (Claude Code, AI agents)'] },
  {
    label: 'Platform & SRE',
    items: [
      'CI/CD (GitHub Actions, GitLab CI)',
      'Infrastructure as Code (Terraform, GitOps)',
      'Cost optimization',
      'SOC2/GDPR compliance',
      'Incident diagnosis',
    ],
  },
];

// Key metrics the CV page and PDF set in bold, per company. /about and the
// markdown twins keep the plain strings.
const cvMetrics: Record<string, string[]> = {
  'NatWest Boxed': ['10–50% per team', '50+ business journeys', '1000+ services'],
  'DataChain (formerly Iterative.ai)': ['40% reduction', '50%'],
  TouK: ['50 TB of data, 16 nodes, 2 TB memory'],
  Equinix: ['3 systems (40 microservices)'],
};

// Wraps the company's key metrics in a responsibility string in <strong>.
export function emphasizeMetrics(company: string, text: string): string {
  return (cvMetrics[company] ?? []).reduce(
    (out, metric) => out.replace(metric, `<strong>${metric}</strong>`),
    text,
  );
}

export interface InlineRun {
  text: string;
  href?: string;
  strong?: boolean;
}

// Some portfolio strings embed inline HTML anchors (rendered with set:html on
// the pages). Split such a string into plain-text runs, keeping each anchor's
// target so markdown/PDF consumers can emit real links, and marking <strong>
// runs. Other tags are stripped; the basic HTML entities are decoded.
export function parseInlineLinks(html: string): InlineRun[] {
  const runs: InlineRun[] = [];
  const inline = /<a\s[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>|<strong>(.*?)<\/strong>/gi;
  let last = 0;
  for (const match of html.matchAll(inline)) {
    if (match.index > last) runs.push({ text: cleanFragment(html.slice(last, match.index)) });
    runs.push(
      match[1] !== undefined
        ? { text: cleanFragment(match[2]), href: match[1] }
        : { text: cleanFragment(match[3]), strong: true },
    );
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
    .map((run) =>
      run.href ? `[${run.text}](${run.href})` : run.strong ? `**${run.text}**` : run.text,
    )
    .join('');
}

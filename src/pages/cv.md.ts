import type { APIRoute } from 'astro';
import { author, yearsSince, experiences, presentations } from '../data/portfolio';
import {
  education,
  languages,
  publications,
  skillGroups,
  credentials,
  inlineRunsToMarkdown,
} from '../data/cv';

export const GET: APIRoute = () => {
  const lines: string[] = [
    '---',
    `title: "CV – ${author.name}"`,
    `description: ${JSON.stringify(`CV of ${author.name} – ${author.role}: ${yearsSince('2012-12')} years in tech, Kubernetes, observability, multi-cloud (AWS, GCP), incident diagnosis and AI agents.`)}`,
    'canonical: https://mjasion.pl/cv/',
    '---',
    '',
    `# ${author.name}`,
    '',
    `**${author.role}** · Warsaw, Poland`,
    '',
    `- Email: ${author.email}`,
    '- Web: https://mjasion.pl',
    '- LinkedIn: https://www.linkedin.com/in/marcinjasion',
    '- GitHub: https://github.com/mjasion',
    '- PDF: https://mjasion.pl/cv.pdf',
    '',
    '## Summary',
    '',
    author.summary,
    '',
    '## Experience',
    '',
  ];

  for (const exp of experiences) {
    lines.push(`### [${exp.company}](${exp.url}) – ${exp.location}`, '', exp.overview, '');
    for (const pos of exp.positions) {
      lines.push(`**${pos.designation}** (${pos.start} – ${pos.end ?? 'Present'})`, '');
      for (const r of pos.responsibilities) {
        lines.push(`- ${inlineRunsToMarkdown(r)}`);
      }
      lines.push('');
    }
  }

  lines.push('## Skills', '');
  for (const group of skillGroups) {
    lines.push(`- **${group.label}:** ${group.items.join(', ')}`);
  }
  lines.push('');

  lines.push('## Certifications & Training', '');
  for (const cert of credentials) {
    lines.push(`- [${cert.name}](${cert.url}) – ${cert.organization} · ${cert.timeline}`);
  }
  lines.push('');

  lines.push('## Talks & Publications', '');
  for (const talk of presentations) {
    lines.push(`- ${talk.name} – ${talk.meetup} · ${talk.date}`);
  }
  for (const pub of publications) {
    lines.push(`- [${pub.title}](${pub.url}) – open-source contribution · ${pub.year}`);
  }
  lines.push('');

  lines.push('## Education', '');
  for (const ed of education) {
    lines.push(`- ${ed.degree} – ${ed.school} (${ed.years})`);
  }
  lines.push('');

  lines.push('## Languages', '');
  for (const lang of languages) {
    lines.push(`- ${lang.name} – ${lang.level}`);
  }
  lines.push('');

  return new Response(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
};

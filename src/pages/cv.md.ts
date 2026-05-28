import type { APIRoute } from 'astro';
import { author, skills, experiences, certifications, presentations } from '../data/portfolio';

export const GET: APIRoute = () => {
  const lines: string[] = [
    '---',
    `title: "CV - ${author.name}"`,
    `description: ${JSON.stringify(`Curriculum vitae of ${author.name} - ${author.designation}.`)}`,
    'canonical: https://mjasion.pl/cv/',
    '---',
    '',
    `# ${author.name}`,
    '',
    `**${author.designation}** · Warsaw, Poland`,
    '',
    `- Email: ${author.email}`,
    '- Web: https://mjasion.pl',
    '- LinkedIn: https://www.linkedin.com/in/marcinjasion',
    '- GitHub: https://github.com/mjasion',
    '',
    '## Summary',
    '',
    author.summary,
    '',
    '## Experience',
    '',
  ];

  for (const exp of experiences) {
    lines.push(`### [${exp.company}](${exp.url}) - ${exp.location}`, '', exp.overview, '');
    for (const pos of exp.positions) {
      lines.push(`**${pos.designation}** (${pos.start} – ${pos.end ?? 'Present'})`, '');
      for (const r of pos.responsibilities) {
        lines.push(`- ${r}`);
      }
      lines.push('');
    }
  }

  lines.push('## Skills', '');
  for (const skill of skills) {
    lines.push(`- **${skill.name}** - ${skill.summary}`);
  }
  lines.push('- **Terraform**, **Helm**, **Prometheus / Grafana**', '');

  lines.push('## Certifications', '');
  for (const cert of certifications) {
    lines.push(`- [${cert.name}](${cert.certificateUrl}) - ${cert.organization} · ${cert.timeline}`);
  }
  lines.push('');

  lines.push('## Talks & Publications', '');
  for (const talk of presentations) {
    lines.push(`- ${talk.name} - ${talk.meetup} · ${talk.date}`);
  }
  lines.push('- DNS query metrics plugin for Telegraf - open-source contribution', '');

  lines.push('## Education', '');
  lines.push('- M.Sc. in Engineering, Computer Science - Warsaw University of Technology (2013–2016)');
  lines.push("- Engineer's degree, Computer Science - Warsaw University of Technology (2009–2013)");
  lines.push('');

  lines.push('## Languages', '');
  lines.push('- Polish - Native');
  lines.push('- English - Professional working');
  lines.push('');

  return new Response(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
};

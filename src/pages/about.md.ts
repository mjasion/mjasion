import type { APIRoute } from 'astro';
import { author, skills, srePractices, experiences, certifications, trainings, presentations } from '../data/portfolio';

export const GET: APIRoute = () => {
  const lines: string[] = [
    '---',
    `title: "About – ${author.name}"`,
    `description: ${JSON.stringify(`${author.name} – ${author.designation}. ${author.summary}`)}`,
    'canonical: https://mjasion.pl/about/',
    '---',
    '',
    `# About ${author.name}`,
    '',
    `**${author.designation}**`,
    '',
    author.summary,
    '',
    '## Contact & Profiles',
    '',
    `- Email: ${author.email}`,
    ...author.socialLinks
      .filter((l) => l.url)
      .map((l) => `- [${l.name}](${l.url})`),
    `- [Public CV (PDF)](${author.cvUrl})`,
    '',
    '## Skills',
    '',
  ];

  for (const skill of skills) {
    const link = skill.url ? `[${skill.name}](${skill.url})` : skill.name;
    lines.push(`- **${link}** – ${skill.summary}`);
  }

  lines.push('', '### SRE Practices', '');
  for (const practice of srePractices) {
    lines.push(`- **${practice.name}** – ${practice.summary}`);
  }

  lines.push('', '## Experience', '');
  for (const exp of experiences) {
    lines.push(`### [${exp.company}](${exp.url}) – ${exp.location}`, '', exp.overview, '');
    for (const pos of exp.positions) {
      lines.push(`**${pos.designation}** (${pos.start} – ${pos.end ?? 'present'})`, '');
      for (const r of pos.responsibilities) {
        lines.push(`- ${r}`);
      }
      lines.push('');
    }
  }

  lines.push('## Certifications', '');
  for (const cert of certifications) {
    lines.push(
      `### [${cert.name}](${cert.certificateUrl})`,
      '',
      `${cert.organization} – ${cert.timeline}${cert.expired ? ' (expired)' : ''}`,
      '',
      cert.overview,
      '',
    );
  }

  lines.push('## Training & Courses', '');
  for (const course of trainings) {
    lines.push(
      `### [${course.name}](${course.url})`,
      '',
      `${course.organization} – ${course.timeline}`,
      '',
      course.overview,
      '',
    );
  }

  lines.push('## Presentations & Talks', '');
  for (const talk of presentations) {
    lines.push(`### ${talk.name}`, '', `${talk.date} – [${talk.meetup}](${talk.meetupUrl})`, '');
    for (const asset of talk.assets) {
      lines.push(`- [${asset.title}](${asset.url})`);
    }
    lines.push('');
  }

  return new Response(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
};

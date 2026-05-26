import type { APIRoute } from 'astro';
import { author } from '../data/portfolio';

export const GET: APIRoute = () => {
  if (import.meta.env.PROD) {
    return new Response(null, { status: 404 });
  }

  const lines: string[] = [
    '---',
    `title: "Now — ${author.name}"`,
    `description: "What ${author.name} is focused on right now — work, learning, and side projects."`,
    'canonical: https://mjasion.pl/now/',
    '---',
    '',
    '# Now',
    '',
    "A snapshot of what I'm focused on right now — inspired by Derek Sivers' /now page idea.",
    '',
    'Last updated 2026-05-26.',
    '',
    '## Work',
    '',
    'Senior SRE at NatWest Boxed in Warsaw. Supporting engineering teams across a system of 1000+ services — mostly incident response, observability work, and the quiet improvements that keep on-call calm.',
    '',
    '## Learning',
    '',
    'Going deeper on agentic systems after wrapping up AI_devs 3: Agents. Currently playing with LLM-driven incident triage — can a model usefully pre-summarise an alert before a human looks at it?',
    '',
    '## Building',
    '',
    'Slowly refreshing this blog — new About, new CV, this page. Long-term goal is to publish more about the day-to-day of running large fleets of services.',
    '',
    '## Reading',
    '',
    '"Observability Engineering" (Majors, Fong-Jones, Miranda) again — it lands differently when the system you operate has four digits of services.',
    '',
  ];

  return new Response(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
};

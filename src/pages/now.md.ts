import type { APIRoute } from 'astro';
import { author } from '../data/portfolio';

export const GET: APIRoute = () => {
  const lines: string[] = [
    '---',
    `title: "Now – ${author.name}"`,
    `description: "What ${author.name} is focused on right now – work, learning, and side projects."`,
    'canonical: https://mjasion.pl/now/',
    '---',
    '',
    '# Now',
    '',
    "A snapshot of what I'm focused on right now – inspired by Derek Sivers' /now page idea.",
    '',
    'Last updated 2026-10-24.',
    '',
    '## Work',
    '',
    "Senior SRE consultant at NatWest Boxed, working in an enabling team for 30+ squads that run 1000+ services. Right now:",
    '',
    '- an investigation agent that pulls Datadog logs, traces, and metrics together with Confluence docs and GitHub code to speed up the first phase of incident analysis',
    '- extending a journey monitoring service that tracks duration and success rate of 50+ business journeys across asynchronous services',
    '- observability audits that make services easier to debug',
    '',
    'Claude is my main model and agent here and across most of my day-to-day work.',
    '',
    '## Learning',
    '',
    'Currently playing with LLM-driven incident triage – can a model usefully pre-summarise an alert before a human looks at it?',
    '',
    '## Building',
    '',
    'Slowly refreshing this blog – new About, new CV, this page. On the side, a couple of family projects running entirely on Cloudflare Workers: a portal for tracking investment returns and computing taxes, and a meal-planning assistant for the family. Both expose their own MCP server, so I can query and update them straight from Claude.',
    '',
    '## Sport',
    '',
    "After two Hyrox finishes – solo in '25 and doubles in '26 here in Warsaw – I'm dialling CrossFit intensity back up and chasing a first strict muscle-up. Also putting more miles on the bike through 2026.",
    '',
    '## Reading',
    '',
    "Re-reading \"Observability Engineering\" (Majors, Fong-Jones, Miranda) – it lands differently when the system you operate has four digits of services. Switching between the book and audiobook of John Eldredge's \"Wild at Heart\" (\"Dzikie serce. Tęsknoty męskiej duszy\" in Polish). For fiction it's audiobooks: Terry Hayes' \"I Am Pilgrim\" and working through Jo Nesbø's catalogue.",
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

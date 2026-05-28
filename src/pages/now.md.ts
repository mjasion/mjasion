import type { APIRoute } from 'astro';
import { author } from '../data/portfolio';

export const GET: APIRoute = () => {
  if (import.meta.env.PROD) {
    return new Response(null, { status: 404 });
  }

  const lines: string[] = [
    '---',
    `title: "Now - ${author.name}"`,
    `description: "What ${author.name} is focused on right now - work, learning, and side projects."`,
    'canonical: https://mjasion.pl/now/',
    '---',
    '',
    '# Now',
    '',
    "A snapshot of what I'm focused on right now - inspired by Derek Sivers' /now page idea.",
    '',
    'Last updated 2026-05-26.',
    '',
    '## Work',
    '',
    "Senior SRE consultant at NatWest Boxed in Warsaw. Supporting almost 30 engineering teams operating a system of 1000+ services. Beyond observability, I'm building agents for incident handling and streamlining the resolution process. Teams are organised using [Team Topologies](https://martinfowler.com/bliki/TeamTopologies.html) - mine is an enabling team, so it cuts across many different stream-aligned squads.",
    '',
    '## Learning',
    '',
    'Currently playing with LLM-driven incident triage - can a model usefully pre-summarise an alert before a human looks at it?',
    '',
    '## Building',
    '',
    'Slowly refreshing this blog - new About, new CV, this page. On the side, a couple of family projects running entirely on Cloudflare Workers: a portal for tracking investment returns and computing taxes, and a meal-planning assistant for the family.',
    '',
    '## Sport',
    '',
    "After two Hyrox finishes - solo in '25 and doubles in '26 here in Warsaw - I'm dialling CrossFit intensity back up and chasing a first strict muscle-up. Also putting more miles on the bike through 2026.",
    '',
    '## Reading',
    '',
    '"Observability Engineering" (Majors, Fong-Jones, Miranda) again - it lands differently when the system you operate has four digits of services. Also started on audiobooks - Terry Hayes\' "I Am Pilgrim" and working through Jo Nesbø\'s catalogue.',
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

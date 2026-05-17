// Cloudflare Pages Function — thin content-negotiation middleware.
// Rewrites /posts/<category>/<slug>/ to /posts/<category>/<slug>.md when the client
// prefers text/markdown via the Accept header. No business logic, no DB, no auth.
// Discovery: PostLayout emits <link rel="alternate" type="text/markdown" ...>.

interface PagesContext {
  request: Request;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
}

const POST_PATH = /^\/posts\/[^/]+\/[^/]+(?:\/[^/]+)*\/?$/;

function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;

  // Parse "type/subtype;q=0.x" entries. Anything with q=0 is excluded.
  const entries = accept.split(',').map((part) => {
    const [type, ...params] = part.trim().split(';');
    let q = 1;
    for (const p of params) {
      const [k, v] = p.trim().split('=');
      if (k === 'q' && v) {
        const parsed = parseFloat(v);
        if (!Number.isNaN(parsed)) q = parsed;
      }
    }
    return { type: type.toLowerCase(), q };
  });

  const md = entries.find((e) => e.type === 'text/markdown' && e.q > 0);
  if (!md) return false;

  const html = entries.find((e) => e.type === 'text/html' && e.q > 0);
  // Pick markdown only if it's at least as preferred as HTML, or HTML isn't requested.
  return !html || md.q >= html.q;
}

export const onRequest = async (context: PagesContext): Promise<Response> => {
  const { request, next } = context;
  const url = new URL(request.url);

  if (request.method === 'GET' && POST_PATH.test(url.pathname) && prefersMarkdown(request.headers.get('accept'))) {
    const cleanPath = url.pathname.replace(/\/$/, '');
    const mdUrl = new URL(url.toString());
    mdUrl.pathname = cleanPath + '.md';

    const mdResponse = await next(new Request(mdUrl.toString(), request));
    if (mdResponse.status === 200) {
      const headers = new Headers(mdResponse.headers);
      headers.set('Content-Type', 'text/markdown; charset=utf-8');
      headers.append('Vary', 'Accept');
      return new Response(mdResponse.body, {
        status: mdResponse.status,
        statusText: mdResponse.statusText,
        headers,
      });
    }
    // Fall through to HTML if the .md asset is missing.
  }

  const response = await next();
  // Advertise Accept-based variance for crawlers/CDN, even on HTML responses.
  if (POST_PATH.test(url.pathname)) {
    const headers = new Headers(response.headers);
    const existingVary = headers.get('Vary');
    if (!existingVary || !/\baccept\b/i.test(existingVary)) {
      headers.append('Vary', 'Accept');
    }
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }
  return response;
};

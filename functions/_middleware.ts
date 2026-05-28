// Cloudflare Pages Function - thin content-negotiation middleware.
// Rewrites page URLs to their .md sibling when the client prefers text/markdown.
// No business logic, no DB, no auth.
// Discovery: PostLayout emits <link rel="alternate" type="text/markdown" ...>.

interface PagesContext {
  request: Request;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
}

const ASSET_EXT = /\.[a-z0-9]+$/i;

function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;

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
  return !html || md.q >= html.q;
}

function rewriteToMd(pathname: string): string | null {
  if (pathname === '/') return '/index.md';
  const last = pathname.split('/').filter(Boolean).pop() ?? '';
  if (ASSET_EXT.test(last)) return null; // asset request - leave it alone
  return pathname.replace(/\/$/, '') + '.md';
}

function approxTokens(byteLength: number): number {
  // Rough heuristic: ~4 chars per token. Good enough for an x-markdown-tokens hint.
  return Math.max(1, Math.round(byteLength / 4));
}

export const onRequest = async (context: PagesContext): Promise<Response> => {
  const { request, next } = context;
  const url = new URL(request.url);
  const isPage = !ASSET_EXT.test(url.pathname.split('/').filter(Boolean).pop() ?? '');

  if (request.method === 'GET' && isPage && prefersMarkdown(request.headers.get('accept'))) {
    const mdPath = rewriteToMd(url.pathname);
    if (mdPath) {
      const mdUrl = new URL(url.toString());
      mdUrl.pathname = mdPath;
      const mdResponse = await next(new Request(mdUrl.toString(), request));
      if (mdResponse.status === 200) {
        const body = await mdResponse.arrayBuffer();
        const headers = new Headers(mdResponse.headers);
        headers.set('Content-Type', 'text/markdown; charset=utf-8');
        headers.set('x-markdown-tokens', String(approxTokens(body.byteLength)));
        const existingVary = headers.get('Vary');
        if (!existingVary || !/\baccept\b/i.test(existingVary)) {
          headers.append('Vary', 'Accept');
        }
        return new Response(body, {
          status: mdResponse.status,
          statusText: mdResponse.statusText,
          headers,
        });
      }
      // Fall through to HTML if the .md asset is missing for this path.
    }
  }

  const response = await next();
  if (isPage) {
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

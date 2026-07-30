/**
 * `unfurl` — server-side page metadata reader for the Create Resource flow.
 *
 * The browser can't fetch arbitrary pages to read their <title>/OG tags (CORS),
 * so `fetchSiteMetadata` in the client calls this Edge Function instead. It
 * fetches the URL server-side, scrapes title / description / preview image /
 * favicon from the HTML, and returns them as JSON. Everything is best-effort:
 * any field it can't find comes back `null`, and the client keeps whatever the
 * user typed.
 *
 * Deploy:  supabase functions deploy unfurl --project-ref <your-project-ref>
 * Local:   supabase functions serve unfurl
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_BYTES = 512 * 1024; // Only the <head> matters; cap the read at 512 KB.
const FETCH_TIMEOUT_MS = 6000;

interface SiteMetadata {
  title: string | null;
  description: string | null;
  image: string | null;
  favicon: string | null;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

/** Pulls a `<meta>` content value by matching either attribute order
 * (`property=…  content=…` or `content=…  property=…`). */
function metaContent(html: string, keys: string[]): string | null {
  for (const key of keys) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const patterns = [
      new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]*content=["']([^"']*)["']`, "i"),
      new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${escaped}["']`, "i"),
    ];
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match?.[1]) return decodeEntities(match[1].trim());
    }
  }
  return null;
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

function resolveUrl(value: string | null, base: string): string | null {
  if (!value) return null;
  try {
    return new URL(value, base).toString();
  } catch {
    return null;
  }
}

function extractFavicon(html: string, base: string): string | null {
  const match = html.match(
    /<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]*href=["']([^"']+)["']/i,
  ) ?? html.match(
    /<link[^>]+href=["']([^"']+)["'][^>]*rel=["'][^"']*icon[^"']*["']/i,
  );
  const resolved = resolveUrl(match?.[1] ?? null, base);
  if (resolved) return resolved;
  // Fall back to Google's favicon service, which always returns something.
  try {
    return `https://www.google.com/s2/favicons?sz=64&domain=${new URL(base).hostname}`;
  } catch {
    return null;
  }
}

async function unfurl(url: string): Promise<SiteMetadata> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "MorrowUnfurl/1.0 (+https://morrow.app)" },
    });
    if (!response.ok || !response.body) {
      return { title: null, description: null, image: null, favicon: null };
    }

    // Read at most MAX_BYTES — the metadata lives in <head>, near the top.
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let html = "";
    let received = 0;
    while (received < MAX_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      html += decoder.decode(value, { stream: true });
      if (/<\/head>/i.test(html)) break; // Everything we need is already in.
    }
    reader.cancel().catch(() => {});

    const finalUrl = response.url || url;
    const titleTag = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? null;

    return {
      title: metaContent(html, ["og:title", "twitter:title"]) ?? (titleTag ? decodeEntities(titleTag) : null),
      description: metaContent(html, ["og:description", "twitter:description", "description"]),
      image: resolveUrl(metaContent(html, ["og:image", "twitter:image", "twitter:image:src"]), finalUrl),
      favicon: extractFavicon(html, finalUrl),
    };
  } finally {
    clearTimeout(timeout);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS_HEADERS });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let url: unknown;
  try {
    ({ url } = await req.json());
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  if (typeof url !== "string") return json({ error: "Missing url" }, 400);

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return json({ error: "Invalid url" }, 400);
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return json({ error: "Only http(s) URLs are supported" }, 400);
  }

  try {
    return json(await unfurl(parsed.toString()));
  } catch {
    // Never surface transport errors — the client treats null as "no metadata".
    return json({ title: null, description: null, image: null, favicon: null });
  }
});

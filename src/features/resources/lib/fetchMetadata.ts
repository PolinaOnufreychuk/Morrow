import { supabase } from "@/lib/supabase/client";

/**
 * Best-effort metadata auto-fetch for Resources, triggered on URL blur in
 * `ResourceForm` after the kind is detected (see `detectKind.ts`). Split by
 * what each source allows straight from the browser vs. what needs our proxy:
 *
 * - GitHub repos: the public REST API (`api.github.com`) is CORS-open and
 *   unauthenticated for public repo reads.
 * - YouTube / Vimeo videos: their public oEmbed endpoints are CORS-open and
 *   unauthenticated, returning `title` + `thumbnail`. (YouTube duration needs
 *   the Data API v3 + an API key, so it's left unset rather than faked.)
 * - Any other website (and Figma): generic OG/`<meta>` unfurling is blocked by
 *   CORS in the browser, so `fetchSiteMetadata` routes through the `unfurl`
 *   Supabase Edge Function (see `supabase/functions/unfurl`), which fetches the
 *   page server-side and returns its title/description/preview image/favicon.
 *
 * Every fetch fails silently (returns `null`): a bad URL, rate limit, network
 * error, or missing/undeployed proxy must never block saving the resource.
 */

export interface GithubRepoMetadata {
  description: string | null;
  language: string | null;
  stars: number;
}

export async function fetchGithubRepoMetadata(url: string): Promise<GithubRepoMetadata | null> {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/i);
  if (!match) return null;
  const owner = match[1];
  const repo = match[2].replace(/\.git$/, "");
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!response.ok) return null;
    const data = await response.json();
    return {
      description: typeof data.description === "string" ? data.description : null,
      language: typeof data.language === "string" ? data.language : null,
      stars: typeof data.stargazers_count === "number" ? data.stargazers_count : 0,
    };
  } catch {
    return null;
  }
}

export interface VideoMetadata {
  title: string;
  thumbnailUrl: string;
}

const YOUTUBE_URL_PATTERN = /(?:youtube\.com|youtu\.be)/i;

export function isYoutubeUrl(url: string): boolean {
  return YOUTUBE_URL_PATTERN.test(url);
}

/** @deprecated Prefer {@link VideoMetadata}; kept as an alias so existing
 * imports keep compiling. */
export type YoutubeVideoMetadata = VideoMetadata;

export async function fetchYoutubeMetadata(url: string): Promise<VideoMetadata | null> {
  if (!isYoutubeUrl(url)) return null;
  return fetchOembedVideo(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
}

export async function fetchVimeoMetadata(url: string): Promise<VideoMetadata | null> {
  if (!/vimeo\.com/i.test(url)) return null;
  return fetchOembedVideo(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`);
}

/** YouTube and Vimeo oEmbed responses share the `title`/`thumbnail_url` shape. */
async function fetchOembedVideo(endpoint: string): Promise<VideoMetadata | null> {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) return null;
    const data = await response.json();
    if (typeof data.title !== "string" || typeof data.thumbnail_url !== "string") return null;
    return { title: data.title, thumbnailUrl: data.thumbnail_url };
  } catch {
    return null;
  }
}

export interface SiteMetadata {
  title: string | null;
  description: string | null;
  image: string | null;
  favicon: string | null;
}

/**
 * Server-side unfurl of an arbitrary page (title/description/preview image/
 * favicon) via the `unfurl` Edge Function. Returns `null` if the function
 * isn't deployed or the page can't be read — the caller always keeps whatever
 * the user typed.
 */
export async function fetchSiteMetadata(url: string): Promise<SiteMetadata | null> {
  try {
    const { data, error } = await supabase.functions.invoke<SiteMetadata>("unfurl", {
      body: { url },
    });
    if (error || !data) return null;
    return {
      title: typeof data.title === "string" ? data.title : null,
      description: typeof data.description === "string" ? data.description : null,
      image: typeof data.image === "string" ? data.image : null,
      favicon: typeof data.favicon === "string" ? data.favicon : null,
    };
  } catch {
    return null;
  }
}

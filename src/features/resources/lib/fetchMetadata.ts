/**
 * Best-effort metadata auto-fetch for Resources, triggered on URL blur in
 * `ResourceForm`. Scoped deliberately to what's reachable straight from the
 * browser with no secret/key and no backend:
 *
 * - GitHub repos: the public REST API (`api.github.com`) is CORS-open and
 *   unauthenticated for public repo reads.
 * - YouTube videos: the public oEmbed endpoint is CORS-open and
 *   unauthenticated, but only returns `title`/`thumbnail_url` — a video's
 *   duration requires the YouTube Data API v3, which needs an API key that
 *   can't be safely embedded in a public client-only app. `duration` is left
 *   for the user to fill in (or simply stays unset), never silently faked.
 *
 * Figma metadata (needs a personal access token) and generic website
 * unfurling (blocked by CORS for most sites) both need a server-side proxy
 * this app doesn't have — intentionally not attempted here.
 *
 * Every fetch fails silently (returns `null`): a bad URL, rate limit, or
 * network error must never block saving the resource.
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

export interface YoutubeVideoMetadata {
  title: string;
  thumbnailUrl: string;
}

const YOUTUBE_URL_PATTERN = /(?:youtube\.com|youtu\.be)/i;

export function isYoutubeUrl(url: string): boolean {
  return YOUTUBE_URL_PATTERN.test(url);
}

export async function fetchYoutubeMetadata(url: string): Promise<YoutubeVideoMetadata | null> {
  if (!isYoutubeUrl(url)) return null;
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
    );
    if (!response.ok) return null;
    const data = await response.json();
    if (typeof data.title !== "string" || typeof data.thumbnail_url !== "string") return null;
    return { title: data.title, thumbnailUrl: data.thumbnail_url };
  } catch {
    return null;
  }
}

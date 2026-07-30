import type { ResourceKind } from "@/types/entities";

/**
 * Infers a Resource's kind straight from its URL, so the Create Resource flow
 * never asks the user to pick a type manually — they paste a link and the
 * platform figures out what it is. Deliberately conservative: anything that
 * isn't a recognised repo/video/design/document host falls back to a plain
 * "link" (Website), which is always a safe default.
 *
 * Kept as a pure host/extension check (no network) so it can run on every
 * keystroke/blur; the matching metadata fetch (see `fetchMetadata.ts`) is what
 * actually reaches out to GitHub/YouTube/Vimeo/the unfurl proxy.
 */

const REPO_HOST = /(?:^|\.)(?:github|gitlab)\.com$/i;
const VIDEO_HOST = /(?:^|\.)(?:youtube\.com|youtu\.be|vimeo\.com)$/i;
const DESIGN_HOST = /(?:^|\.)figma\.com$/i;

export function detectResourceKind(url: string): ResourceKind {
  let host: string;
  let pathname: string;
  try {
    const parsed = new URL(url);
    host = parsed.hostname;
    pathname = parsed.pathname;
  } catch {
    // Not yet a valid absolute URL (user still typing) — treat as a website.
    return "link";
  }

  if (DESIGN_HOST.test(host)) return "preview";
  if (REPO_HOST.test(host)) return "repo";
  if (VIDEO_HOST.test(host)) return "video";
  if (/\.pdf(?:$|[?#])/i.test(pathname)) return "pdf";
  return "link";
}

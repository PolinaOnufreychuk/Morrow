import type { ResourceFormValues } from "../components/ResourceForm";
import type { CreateResourceInput } from "../types";

/** Hostname without a leading `www.`, or `""` for a not-yet-valid URL. Used as
 * the title fallback so a resource saved with an auto-detected type but no
 * fetched/typed title still gets a sensible, human-readable name. */
function safeHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** Builds the kind-specific fields each Resource variant requires. The create
 * form no longer asks for a type — `values.kind` is auto-detected from the URL
 * (see `detectKind.ts`) — and Title is optional, so each branch derives a
 * non-empty title fallback from the URL to satisfy the strict create schema. */
export function toCreateInput(values: ResourceFormValues, projectIds: string[] = []): CreateResourceInput {
  const host = safeHostname(values.url);
  const typedTitle = values.title?.trim() ?? "";
  const shared = {
    title: typedTitle || host || values.url,
    url: values.url,
    description: values.description?.trim() || null,
    tags: [values.category],
    projectIds,
  };

  switch (values.kind) {
    case "repo": {
      const match = values.url.match(/(?:github|gitlab)\.com\/([^/]+)\/([^/]+)/i);
      const repoName = match?.[2]?.replace(/\.git$/, "") ?? "";
      return {
        ...shared,
        title: typedTitle || repoName || host || values.url,
        kind: "repo",
        owner: match?.[1] ?? "",
        repoName: repoName || (typedTitle || host || values.url),
        language: values.language ?? null,
        stars: values.stars ?? null,
      };
    }
    case "video":
      return {
        ...shared,
        kind: "video",
        thumbnailUrl: values.thumbnailUrl ?? null,
        duration: null,
      };
    case "pdf":
      return {
        ...shared,
        kind: "pdf",
        filename: values.url.split("/").pop() || `${shared.title}.pdf`,
        pageCount: null,
      };
    case "preview":
      return {
        ...shared,
        kind: "preview",
        previewImageUrl: values.previewImageUrl || null,
        isFigma: values.isFigma ?? /figma\.com/i.test(values.url),
      };
    case "image":
      return { ...shared, kind: "image", coverImageUrl: values.coverImageUrl || values.url };
    case "link":
    default:
      return { ...shared, kind: "link", readingMinutes: null };
  }
}

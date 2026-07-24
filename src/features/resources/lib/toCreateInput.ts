import type { ResourceFormValues } from "../components/ResourceForm";
import type { CreateResourceInput } from "../types";

/** Builds the kind-specific fields each Resource variant requires, deriving
 * sensible defaults from the URL/title since the create form only exposes
 * the fields shown in the design (Type/URL/Title/Description/Category). */
export function toCreateInput(values: ResourceFormValues, projectIds: string[] = []): CreateResourceInput {
  const shared = {
    title: values.title,
    url: values.url,
    description: values.description?.trim() || null,
    tags: [values.category],
    projectIds,
  };

  switch (values.kind) {
    case "repo": {
      const match = values.url.match(/github\.com\/([^/]+)\/([^/]+)/i);
      return {
        ...shared,
        kind: "repo",
        owner: match?.[1] ?? "",
        repoName: match?.[2]?.replace(/\.git$/, "") ?? values.title,
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
        filename: values.url.split("/").pop() || `${values.title}.pdf`,
        pageCount: null,
      };
    case "preview":
      return {
        ...shared,
        kind: "preview",
        previewImageUrl: values.previewImageUrl || null,
        isFigma: values.isFigma ?? false,
      };
    case "image":
      return { ...shared, kind: "image", coverImageUrl: values.coverImageUrl || values.url };
    case "link":
    default:
      return { ...shared, kind: "link", readingMinutes: null };
  }
}

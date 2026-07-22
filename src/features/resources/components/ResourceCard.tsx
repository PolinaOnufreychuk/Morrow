import { GlassCard } from "@/components/shared/GlassCard";
import { Badge } from "@/components/ui/badge";
import { GithubMark } from "@/design-system/icons/GithubMark";
import { FigmaMark } from "@/design-system/icons/FigmaMark";
import { cn } from "@/lib/utils";
import type {
  ImageResource,
  PdfResource,
  PreviewResource,
  RepoResource,
  Resource,
  VideoResource,
} from "@/types/entities";

export type ResourceCardVariant = "compact" | "full";

export interface ResourceCardProps {
  resource: Resource;
  variant?: ResourceCardVariant;
  /** Edit Mode: card becomes a selectable surface instead of a navigating link. */
  editMode?: boolean;
  onSelectToggle?: (resource: Resource) => void;
}

/** Hostname without "www." — the shared "secondary meta" fallback for any kind with a URL. */
function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** One consistent secondary-meta string per kind: reading time, page count, or domain. */
function secondaryMeta(resource: Resource): string {
  switch (resource.kind) {
    case "link":
      return resource.readingMinutes ? `${resource.readingMinutes} min read` : hostnameOf(resource.url);
    case "pdf":
      return resource.pageCount ? `${resource.pageCount} pages` : resource.filename;
    default:
      return hostnameOf(resource.url);
  }
}

/**
 * ONE polymorphic resource card. `kind` drives the layout via an exhaustive
 * `switch` with a `never` default — adding a ResourceKind fails the type
 * check here until a branch is added. `kind` only affects the visual media
 * treatment, never filtering (docs/FEATURES.md). Every kind shares one
 * footer shape: a single tag chip and a secondary-meta string (domain/
 * reading time/page count).
 *
 * Normal mode: the whole card is a link — clicking it opens `resource.url`
 * in a new tab. Edit Mode: the card becomes purely selectable (no
 * navigation); the caller renders the selection checkbox as a sibling.
 */
export function ResourceCard({ resource, variant = "compact", editMode = false, onSelectToggle }: ResourceCardProps) {
  const content = (
    <>
      <ResourceMedia resource={resource} variant={variant} />

      <div className="flex flex-col gap-2">
        <p className="text-[15px] font-medium leading-snug text-text-primary">{resource.title}</p>
        {resource.description && (
          <p className="line-clamp-2 text-[13px] text-text-secondary">{resource.description}</p>
        )}
      </div>

      <footer className="mt-auto flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          {resource.tags[0] && <Badge variant="neutral">{resource.tags[0]}</Badge>}
          <span className="text-[12px] text-text-tertiary">{secondaryMeta(resource)}</span>
        </div>
      </footer>
    </>
  );

  const cardClassName = "group flex flex-col gap-3 p-4";

  if (editMode) {
    return (
      <GlassCard
        interactive
        role="button"
        tabIndex={0}
        onClick={() => onSelectToggle?.(resource)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelectToggle?.(resource);
          }
        }}
        className={cardClassName}
      >
        {content}
      </GlassCard>
    );
  }

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className={cn("glass-card block cursor-pointer rounded-card", cardClassName)}
    >
      {content}
    </a>
  );
}

function ResourceMedia({ resource, variant }: { resource: Resource; variant: ResourceCardVariant }) {
  switch (resource.kind) {
    case "link":
      // Link resources have no thumbnail — title/description/footer carry the card.
      return null;
    case "repo":
      return <RepoMedia resource={resource} />;
    case "video":
      return <VideoMedia resource={resource} variant={variant} />;
    case "pdf":
      return <PdfMedia resource={resource} />;
    case "preview":
      return <PreviewMedia resource={resource} variant={variant} />;
    case "image":
      return <ImageMedia resource={resource} variant={variant} />;
    default: {
      // Exhaustiveness guard — a new ResourceKind will fail to compile here.
      const _exhaustive: never = resource;
      return _exhaustive;
    }
  }
}

function RepoMedia({ resource }: { resource: RepoResource }) {
  return (
    <div className="flex items-center gap-3 rounded-card-image border border-border-subtle bg-surface-card/60 p-3">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-chip bg-ink-900 text-white">
        <GithubMark size={20} />
      </span>
      <span className="truncate text-[13px] font-medium text-text-primary">
        {resource.owner}/{resource.repoName}
      </span>
    </div>
  );
}

function VideoMedia({ resource, variant }: { resource: VideoResource; variant: ResourceCardVariant }) {
  return (
    <div className={cn("relative overflow-hidden rounded-card-image", variant === "full" ? "h-48" : "h-36")}>
      {resource.thumbnailUrl ? (
        <img src={resource.thumbnailUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full bg-sage-100" />
      )}
      <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-surface-card/85 backdrop-blur-sm">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-text-primary">
          <path d="M4 3v10l9-5-9-5Z" />
        </svg>
      </span>
      {resource.duration && (
        <span className="absolute bottom-2 right-2 rounded-chip bg-ink-900/70 px-1.5 py-0.5 text-[11px] text-cream-50">
          {resource.duration}
        </span>
      )}
    </div>
  );
}

function PdfMedia({ resource }: { resource: PdfResource }) {
  return (
    <div className="flex items-center gap-3 rounded-card-image border border-border-subtle bg-surface-card/60 p-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-chip bg-blush-100 text-[11px] font-bold text-blush-600">
        PDF
      </span>
      <span className="truncate text-[13px] font-medium text-text-primary">{resource.filename}</span>
    </div>
  );
}

function PreviewMedia({
  resource,
  variant,
}: {
  resource: PreviewResource;
  variant: ResourceCardVariant;
}) {
  const height = variant === "full" ? "h-48" : "h-36";
  if (!resource.previewImageUrl) {
    return (
      <div className={cn("flex items-center justify-center rounded-card-image bg-cream-100", height)}>
        {resource.isFigma ? <FigmaMark size={40} /> : <div className="h-10 w-10 rounded-chip bg-sage-200" />}
      </div>
    );
  }
  return (
    <div className={cn("relative overflow-hidden rounded-card-image", height)}>
      <img src={resource.previewImageUrl} alt="" className="h-full w-full object-cover" />
      {resource.isFigma && (
        <span className="absolute left-2 top-2 rounded-chip bg-surface-card/85 px-2 py-0.5 text-[11px] font-medium text-text-primary backdrop-blur-sm">
          Figma
        </span>
      )}
    </div>
  );
}

function ImageMedia({ resource, variant }: { resource: ImageResource; variant: ResourceCardVariant }) {
  return (
    <div className={cn("overflow-hidden rounded-card-image", variant === "full" ? "h-48" : "h-36")}>
      <img src={resource.coverImageUrl} alt="" className="h-full w-full object-cover" />
    </div>
  );
}

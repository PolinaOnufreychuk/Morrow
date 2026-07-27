/**
 * Shared entity types — Morrow.
 * Mirrors docs/DATABASE.md. Notes and Resources are discriminated unions so
 * their polymorphic cards can switch exhaustively over the discriminant.
 */

export type ISODateString = string; // e.g. "2026-07-16"
export type ISOTimestamp = string; // e.g. "2026-07-16T10:48:00Z"

/** Shared audit fields carried by every top-level, archivable entity. */
interface BaseEntity {
  id: string;
  isArchived: boolean;
  /** Set when `isArchived` flips true, cleared on restore — drives the
   * Archive screen's expiry countdown and retention sweep. `null` while
   * the entity is active. */
  archivedAt: ISOTimestamp | null;
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
}

export interface ExternalLink {
  label: string;
  url: string;
}

/* -------------------------------------------------------------------------- */
/* Projects                                                                    */
/* -------------------------------------------------------------------------- */

export type ProjectStatus = "in-progress" | "review" | "done";

export interface Project extends BaseEntity {
  title: string;
  coverImageUrl: string | null;
  description: string | null;
  status: ProjectStatus;
  deadline: ISODateString | null;
  category: string | null;
  tags: string[];
  externalLinks: ExternalLink[];
  notes: string | null;
}

/* -------------------------------------------------------------------------- */
/* Inspiration                                                                 */
/* -------------------------------------------------------------------------- */

export interface InspirationBoard extends BaseEntity {
  title: string;
  coverImageUrl: string | null;
  tags: string[];
  notes: string | null;
  projectIds: string[];
}

export interface InspirationReference {
  id: string;
  boardId: string;
  imageUrl: string;
  sourceUrl: string | null;
  position: number;
  createdAt: ISOTimestamp;
}

/* -------------------------------------------------------------------------- */
/* Notes — discriminated union on `type` (5 variants)                          */
/* -------------------------------------------------------------------------- */

export type NoteType = "text" | "checklist" | "image" | "quote" | "pdf";

export interface ChecklistItem {
  text: string;
  done: boolean;
}

/** Fields common to every note variant. */
interface NoteBase extends BaseEntity {
  title: string;
  projectIds: string[];
}

export interface TextNote extends NoteBase {
  type: "text";
  body: string;
}

export interface ChecklistNote extends NoteBase {
  type: "checklist";
  items: ChecklistItem[];
}

export interface ImageNote extends NoteBase {
  type: "image";
  coverImageUrl: string;
}

export interface QuoteNote extends NoteBase {
  type: "quote";
  quote: string;
  author: string | null;
}

export interface PdfNote extends NoteBase {
  type: "pdf";
  filename: string;
  pageCount: number | null;
}

export type Note = TextNote | ChecklistNote | ImageNote | QuoteNote | PdfNote;

/* -------------------------------------------------------------------------- */
/* Resources — discriminated union on `kind` (6 variants)                      */
/* -------------------------------------------------------------------------- */

export type ResourceKind = "link" | "repo" | "video" | "pdf" | "preview" | "image";

interface ResourceBase extends BaseEntity {
  title: string;
  url: string;
  description: string | null;
  tags: string[];
  projectIds: string[];
}

export interface LinkResource extends ResourceBase {
  kind: "link";
  readingMinutes: number | null;
}

export interface RepoResource extends ResourceBase {
  kind: "repo";
  owner: string;
  repoName: string;
  language: string | null;
  stars: number | null;
}

export interface VideoResource extends ResourceBase {
  kind: "video";
  thumbnailUrl: string | null;
  duration: string | null;
}

export interface PdfResource extends ResourceBase {
  kind: "pdf";
  filename: string;
  pageCount: number | null;
}

export interface PreviewResource extends ResourceBase {
  kind: "preview";
  previewImageUrl: string | null;
  isFigma: boolean;
}

export interface ImageResource extends ResourceBase {
  kind: "image";
  coverImageUrl: string;
}

export type Resource =
  | LinkResource
  | RepoResource
  | VideoResource
  | PdfResource
  | PreviewResource
  | ImageResource;

/* -------------------------------------------------------------------------- */
/* Attachments — shared by Projects and Inspiration boards (see              */
/* docs/DATABASE.md's Storage section)                                        */
/* -------------------------------------------------------------------------- */

export type AttachmentParentType = "project" | "inspiration_board";

export interface Attachment {
  id: string;
  parentType: AttachmentParentType;
  parentId: string;
  storagePath: string;
  fileSize: number;
  mimeType: string;
  createdAt: ISOTimestamp;
}

/* -------------------------------------------------------------------------- */
/* Archive                                                                     */
/* -------------------------------------------------------------------------- */

export type ArchiveSourceType = "project" | "inspiration_board" | "note" | "resource";

export interface ArchiveEntry {
  sourceType: ArchiveSourceType;
  id: string;
  title: string;
  thumbnailUrl: string | null;
  archivedAt: ISOTimestamp;
}

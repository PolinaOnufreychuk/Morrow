# Database — Morrow

Postgres via Supabase, used for data + Storage only — **no Supabase Auth**. This is a single-user personal tool; there is no multi-tenant design to preserve.

## Tables

### projects
- `id` (uuid, PK)
- `title` (text)
- `cover_image_url` (text, nullable)
- `description` (text, nullable)
- `status` (text)
- `deadline` (date, nullable) — manual field, no calendar UI
- `tags` (text[], default `{}`)
- `external_links` (jsonb, array of `{ label: text, url: text }` — e.g. Figma, GitHub, Demo)
- `notes` (text, nullable)
- `is_archived` (boolean, default `false`)
- `created_at`, `updated_at` (timestamptz)

### inspiration_boards
- `id` (uuid, PK)
- `title` (text)
- `cover_image_url` (text, nullable — typically the first reference's image)
- `tags` (text[], default `{}`)
- `notes` (text, nullable)
- `project_id` (uuid, FK → projects.id, nullable — lets a board appear embedded on a Project Details page)
- `is_archived` (boolean, default `false`)
- `created_at`, `updated_at` (timestamptz)

### inspiration_references
Individual images within a board — supports the fullscreen viewer's navigation and multi-select board editing.
- `id` (uuid, PK)
- `board_id` (uuid, FK → inspiration_boards.id)
- `image_url` (text)
- `source_url` (text, nullable — original URL the reference was saved from)
- `position` (int, for ordering/navigation order)
- `created_at` (timestamptz)

### notes
Typed content — see [FEATURES.md](FEATURES.md) for the 8 visual types.
- `id` (uuid, PK)
- `type` (text enum: `'text'` | `'todo'` | `'checklist'` | `'idea'` | `'meeting'` | `'research'` | `'code'` | `'bookmark'`)
- `title` (text)
- `content` (text, nullable — used by `text`, `idea`, `meeting`, `research`, `code`)
- `items` (jsonb, nullable — array of `{ text: string, done: boolean }`, used by `todo`, `checklist`)
- `url` (text, nullable — used by `bookmark`)
- `project_id` (uuid, FK → projects.id, nullable — lets a note appear embedded on a Project Details page)
- `is_archived` (boolean, default `false`)
- `created_at`, `updated_at` (timestamptz)

### resources
- `id` (uuid, PK)
- `title` (text)
- `url` (text)
- `description` (text, nullable)
- `tags` (text[], default `{}`)
- `project_id` (uuid, FK → projects.id, nullable — lets a resource appear embedded on a Project Details page)
- `is_archived` (boolean, default `false`)
- `created_at`, `updated_at` (timestamptz)

### attachments
Optional lightweight files, only for `projects` and `inspiration_boards` (not notes or resources).
- `id` (uuid, PK)
- `parent_type` (text enum: `'project'` | `'inspiration_board'`)
- `parent_id` (uuid — references `projects.id` or `inspiration_boards.id` depending on `parent_type`)
- `storage_path` (text — points into Supabase Storage bucket)
- `file_size` (int)
- `mime_type` (text — one of: `image/png`, `image/jpeg`, `image/webp`, `image/svg+xml`, `application/pdf`)
- `created_at` (timestamptz)

## Tags

Simple `text[]` column per entity (Projects, Inspiration boards, Resources) — no separate `tags` table or join tables. Tags exist only for organization and are folded into each module's local search, not a dedicated filter UI. On Project Details, tags render as Linear-inspired interactive/editable chips (see [DESIGN.md](DESIGN.md)) — still backed by the same `text[]` column, no schema change needed for that interaction style.

## Project-scoped content

Inspiration boards, Notes, and Resources each carry an optional `project_id`. When set, the item appears embedded on that Project's Details page, rendered with its own native card component (see [DESIGN.md](DESIGN.md) — Cards). Unscoped items (`project_id IS NULL`) simply live in their own module's list.

## Archive

Archiving is a soft-delete flag (`is_archived`), not a separate table. The Archive screen queries all four archivable tables (`projects`, `inspiration_boards`, `notes`, `resources`) filtered by `is_archived = true` — either four parallel queries merged client-side, or a Postgres view unioning the four with a `source_type` discriminant column. Rendered with one shared archive card component; the source type shows as a badge/metadata rather than a different card layout per type.

## Access

No RLS / auth-based access control — the app uses the Supabase anon key directly since it's a single-user personal tool with no login. **Before any public deployment**, revisit this (e.g. lock down via a Supabase Edge Function or add auth) since an unrestricted anon key is only appropriate for local/personal use.

## Search

Local, per-module only — no global search or cross-table index. Use Postgres trigram/full-text indexes scoped to each table's searchable columns:
- `projects`: `title`, `description`, `notes`, `tags`
- `inspiration_boards`: `title`, `notes`, `tags`
- `notes`: `title`, `content` (where applicable)
- `resources`: `title`, `description`, `tags`

## Storage

One Supabase Storage bucket for attachments and reference images, objects scoped by `parent_type/parent_id/filename`. Allowed MIME types: PNG, JPG, WEBP, SVG, small PDF. Enforce a max file size at the client + bucket policy level (exact limit TBD before Phase 1 attachments work). This is explicitly not a general file storage service — attachments are for supplementary context only.

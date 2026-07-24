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
- `category` (text, nullable) — single classification value, fixed vocabulary (see `PROJECT_CATEGORY_OPTIONS`), distinct from free-form `tags`
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
- `is_archived` (boolean, default `false`)
- `created_at`, `updated_at` (timestamptz)

A board can appear on more than one Project Details page — see `project_boards` under **Project-scoped content** below.

### inspiration_references
Individual images within a board — supports the fullscreen viewer's navigation and multi-select board editing.
- `id` (uuid, PK)
- `board_id` (uuid, FK → inspiration_boards.id)
- `image_url` (text)
- `source_url` (text, nullable — original URL the reference was saved from)
- `position` (int, for ordering/navigation order)
- `created_at` (timestamptz)

### notes
Typed content — see [FEATURES.md](FEATURES.md) for the 10 visual types. `type` determines which of the type-specific columns are populated; all are nullable and unused columns stay `NULL` for a given type.
- `id` (uuid, PK)
- `type` (text enum: `'text'` | `'checklist'` | `'bookmark'` | `'image'` | `'moodboard'` | `'code'` | `'quote'` | `'recipe'` | `'pdf'` | `'meeting'`)
- `title` (text)
- `body` (text, nullable — used by `text`)
- `items` (jsonb, nullable — array of `{ text: string, done: boolean }`, used by `checklist`)
- `url` (text, nullable — used by `bookmark`)
- `favicon_url` (text, nullable), `domain` (text, nullable), `snippet` (text, nullable) — used by `bookmark`
- `cover_image_url` (text, nullable — used by `image`)
- `images` (text[], nullable — exactly 4 image URLs, used by `moodboard`)
- `language` (text, nullable), `code` (text, nullable) — used by `code`
- `quote` (text, nullable), `author` (text, nullable) — used by `quote`
- `ingredients` (text[], nullable — used by `recipe`)
- `filename` (text, nullable), `page_count` (int, nullable) — used by `pdf`
- `attendees` (jsonb, nullable — array of `{ name: string, avatar_url: string|null }`), `agenda` (text[], nullable) — used by `meeting`
- `is_archived` (boolean, default `false`)
- `created_at`, `updated_at` (timestamptz)

### resources
`kind` determines which of the type-specific columns are populated.
- `id` (uuid, PK)
- `kind` (text enum: `'link'` | `'repo'` | `'video'` | `'pdf'` | `'preview'` | `'image'`)
- `title` (text)
- `url` (text)
- `description` (text, nullable)
- `tags` (text[], default `{}`)
- `reading_minutes` (int, nullable) — used by `link`
- `owner` (text, nullable), `repo_name` (text, nullable), `language` (text, nullable), `stars` (int, nullable) — used by `repo`
- `thumbnail_url` (text, nullable), `duration` (text, nullable) — used by `video`
- `filename` (text, nullable), `page_count` (int, nullable) — used by `pdf`
- `preview_image_url` (text, nullable), `is_figma` (boolean, default `false`) — used by `preview`
- `cover_image_url` (text, nullable) — used by `image`
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

Inspiration boards, Notes, and Resources can each be linked to any number of Projects via a join table — `project_boards`, `project_notes`, `project_resources` (each a `(project_id, entity_id)` composite PK, `on delete cascade` both ways). A linked item appears embedded on every Project Details page it's linked to, rendered with its own native card component (see [DESIGN.md](DESIGN.md) — Cards). Items with no rows in the relevant join table simply live in their own module's list.

## Archive

Archiving is a soft-delete flag (`is_archived`), not a separate table. The Archive screen queries all four archivable tables (`projects`, `inspiration_boards`, `notes`, `resources`) filtered by `is_archived = true` — either four parallel queries merged client-side, or a Postgres view unioning the four with a `source_type` discriminant column. Rendered with one shared archive card component; the source type shows as a badge/metadata rather than a different card layout per type.

## Access

No RLS / auth-based access control — the app uses the Supabase anon key directly since it's a single-user personal tool with no login. **Before any public deployment**, revisit this (e.g. lock down via a Supabase Edge Function or add auth) since an unrestricted anon key is only appropriate for local/personal use.

## Search

Local, per-module only — no global search or cross-table index. Use Postgres trigram/full-text indexes scoped to each table's searchable columns:
- `projects`: `title`, `description`, `notes`, `tags`
- `inspiration_boards`: `title`, `notes`, `tags`
- `notes`: `title`, plus whichever of `body`/`snippet`/`quote`/`ingredients`/`agenda` applies to the row's `type`
- `resources`: `title`, `description`, `tags`

## Storage

One public Supabase Storage bucket (`attachments`, see `supabase/storage.sql`) for both real `attachments` rows and "loose" cover/reference images that only ever populate a plain URL column. Max file size: 5MB, enforced both client-side (`src/lib/supabase/storage.ts`) and via the bucket's own `file_size_limit`. Allowed MIME types: PNG, JPG, WEBP, SVG, small PDF. This is explicitly not a general file storage service — attachments are for supplementary context only.

Two path conventions inside the bucket:
- Table-backed attachments (Projects + Inspiration boards): `${parent_type}/${parent_id}/${filename}`.
- Loose cover/reference images (Project/Board cover, Inspiration references, Resource cover — not tracked in any table): `covers/${surface}/${uuid}-${filename}`.

Loose cover images are never cleaned up from Storage when replaced or when their parent is deleted (no row tracks them) — an accepted tradeoff for a personal, low-volume tool. Table-backed attachments ARE cleaned up: on their own delete action, and pre-emptively when their parent project/board is deleted (no DB cascade exists for this polymorphic table).

No RLS on the Postgres side, but Supabase Storage always enforces RLS on `storage.objects` regardless — see the policies in `supabase/storage.sql` granting the anon key select/insert/update/delete scoped to this one bucket.

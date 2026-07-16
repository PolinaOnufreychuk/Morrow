# Database — Designer Workspace

Postgres via Supabase, used for data + Storage only — **no Supabase Auth**. This is a single-user personal tool; there is no multi-tenant design to preserve.

## Tables

### projects
- `id` (uuid, PK)
- `title` (text)
- `cover_image_url` (text, nullable)
- `description` (text, nullable)
- `status` (text)
- `tags` (text[], default `{}`)
- `external_links` (jsonb, array of `{ label: text, url: text }` — e.g. Figma, GitHub, Demo)
- `notes` (text, nullable)
- `created_at`, `updated_at` (timestamptz)

### inspiration
- `id` (uuid, PK)
- `title` (text)
- `url` (text)
- `cover_image_url` (text, nullable)
- `tags` (text[], default `{}`)
- `notes` (text, nullable)
- `created_at`, `updated_at` (timestamptz)

### notes
- `id` (uuid, PK)
- `title` (text)
- `text` (text)
- `created_at`, `updated_at` (timestamptz)

### resources
- `id` (uuid, PK)
- `title` (text)
- `url` (text)
- `description` (text, nullable)
- `tags` (text[], default `{}`)
- `created_at`, `updated_at` (timestamptz)

### attachments
Optional lightweight files, only for `projects` and `inspiration` (not notes or resources).
- `id` (uuid, PK)
- `parent_type` (text enum: `'project'` | `'inspiration'`)
- `parent_id` (uuid — references `projects.id` or `inspiration.id` depending on `parent_type`)
- `storage_path` (text — points into Supabase Storage bucket)
- `file_size` (int)
- `mime_type` (text — one of: `image/png`, `image/jpeg`, `image/webp`, `image/svg+xml`, `application/pdf`)
- `created_at` (timestamptz)

## Tags

Simple `text[]` column per entity — no separate `tags` table or join tables. This keeps the schema flat for the MVP; tags exist only for organization and are folded into each module's local search, not a dedicated filter UI.

## Access

No RLS / auth-based access control — the app uses the Supabase anon key directly since it's a single-user personal tool with no login. **Before any public deployment**, revisit this (e.g. lock down via a Supabase Edge Function or add auth) since an unrestricted anon key is only appropriate for local/personal use.

## Search

Local, per-module only — no global search or cross-table index. Use Postgres trigram/full-text indexes scoped to each table's searchable columns:
- `projects`: `title`, `description`, `notes`, `tags`
- `inspiration`: `title`, `notes`, `tags`
- `notes`: `title`, `text`
- `resources`: `title`, `description`, `tags`

## Storage

One Supabase Storage bucket for attachments, objects scoped by `parent_type/parent_id/filename`. Allowed MIME types: PNG, JPG, WEBP, SVG, small PDF. Enforce a max file size at the client + bucket policy level (exact limit TBD before Phase 1 attachments work). This is explicitly not a general file storage service — attachments are for supplementary context only.

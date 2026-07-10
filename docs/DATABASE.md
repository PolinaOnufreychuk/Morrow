# Database — Designer Workspace

Postgres via Supabase. Designed so team/workspace collaboration (Phase 4 in [ROADMAP.md](ROADMAP.md)) can be added later by adding rows/policies, not by changing table shapes.

## Design decision: workspaces exist from day one

Every project belongs to a `workspace`, not directly to a `user`. In the MVP, each user gets exactly one auto-created personal workspace and is its only member. This is the one piece of "future-proofing" complexity we accept now — it avoids a painful migration later when real multi-user workspaces ship.

## Tables

### profiles
Extends Supabase `auth.users`.
- `id` (uuid, PK, = auth.users.id)
- `full_name` (text)
- `avatar_url` (text, nullable)
- `created_at` (timestamptz)

### workspaces
- `id` (uuid, PK)
- `name` (text)
- `owner_id` (uuid, FK → profiles.id)
- `is_personal` (boolean, default true) — MVP only ever creates personal workspaces
- `created_at` (timestamptz)

### workspace_members
Stub table, unused in MVP beyond one row (the owner). Enables Phase 4 without schema changes.
- `workspace_id` (uuid, FK → workspaces.id)
- `user_id` (uuid, FK → profiles.id)
- `role` (text: 'owner' | 'member', default 'owner')
- PK: (`workspace_id`, `user_id`)

### clients
- `id` (uuid, PK)
- `workspace_id` (uuid, FK → workspaces.id)
- `name` (text)
- `email` (text, nullable)
- `contact_info` (text, nullable)
- `notes` (text, nullable)
- `created_at` (timestamptz)

### projects
- `id` (uuid, PK)
- `workspace_id` (uuid, FK → workspaces.id)
- `client_id` (uuid, FK → clients.id, nullable)
- `name` (text)
- `status` (text enum: 'active' | 'on_hold' | 'completed' | 'archived')
- `deadline` (date, nullable)
- `description` (text, nullable)
- `created_at`, `updated_at` (timestamptz)

### tasks
- `id` (uuid, PK)
- `project_id` (uuid, FK → projects.id)
- `title` (text)
- `is_done` (boolean, default false)
- `position` (int, for manual ordering)
- `created_at` (timestamptz)

### notes
- `id` (uuid, PK)
- `project_id` (uuid, FK → projects.id)
- `content` (text)
- `created_at`, `updated_at` (timestamptz)

### attachments
- `id` (uuid, PK)
- `project_id` (uuid, FK → projects.id)
- `type` (text enum: 'link' | 'file')
- `label` (text)
- `url` (text, nullable — required if type='link')
- `storage_path` (text, nullable — required if type='file', points into Supabase Storage bucket)
- `file_size`, `mime_type` (nullable, file only)
- `created_at` (timestamptz)

## Row Level Security

RLS enabled on every table except `profiles` (self-only). Policy shape: a user may read/write a row if they are a member of its `workspace_id` (via `workspace_members`) — for child tables (projects → tasks/notes/attachments), resolve `workspace_id` through the parent `project_id`.

## Indexes

- `projects (workspace_id, status)` — dashboard filtering
- `projects (deadline)` — upcoming-deadline sorting
- `tasks (project_id, position)`
- Trigram/full-text index on `projects.name` and `clients.name` for search (Phase 2)

## Storage

One Supabase Storage bucket, objects scoped by `workspace_id/project_id/filename`, access controlled via storage RLS mirroring the `attachments` policy. Enforce a max file size limit at the client + storage policy level (exact limit TBD before Phase 1 attachments work).

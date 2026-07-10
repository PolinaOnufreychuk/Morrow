# Features — Designer Workspace

Grouped by module. Each item tagged `MVP` or `Later` (see [ROADMAP.md](ROADMAP.md)).

## Auth — `MVP`

- Sign up / log in / log out (Supabase Auth, email+password)
- Personal workspace auto-created on first sign-up

## Projects — `MVP`

- Create / edit / delete a project
- Fields: name, status, deadline, linked client, description
- Status values: active, on hold, completed, archived
- Project detail view aggregates its tasks, notes, attachments

## Clients — `MVP`

- Create / edit / delete a client
- Fields: name, email, contact info, free-text notes
- Client detail view lists all their projects

## Tasks — `MVP`

- Add / toggle done / delete a task within a project
- Manual reordering
- Simple checklist UI, not a full kanban/board (per "avoid unnecessary features")

## Notes — `MVP`

- One free-text note area per project (not multiple notes v1)
- Autosave on edit

## Attachments — `MVP`

- Add a link (URL + label) — e.g. pointing at Figma/Drive
- Upload a small file (brief, screenshot, PDF) — size-limited, stored in Supabase Storage
- List view per project, delete individual attachments

## Dashboard — `Later (Phase 2)`

- Overview of all projects across the workspace
- Group/sort by status and upcoming deadline
- Entry point / primary action always visible (per UX rules)

## Search & Filter — `Later (Phase 2)`

- Search projects and clients by name
- Filter project list by status, client, deadline range

## Polish — `Later (Phase 3)`

- Empty states with a clear next action for every list (no projects yet, no tasks yet, etc.)
- Intentional loading and error states (not generic spinners)
- Keyboard shortcuts for: new project, new task, focus search
- Full responsive + accessibility pass

## Deferred beyond MVP — `Later (Phase 4)`

- Team workspaces, invites, member roles (enabled by `workspace_members`, see [DATABASE.md](DATABASE.md))
- Project templates (Logo, Brand Book, Web Design, ...)
- Deadline reminders/notifications
- Figma/Drive API integrations (live previews instead of manual links)
- Premium tier / monetization

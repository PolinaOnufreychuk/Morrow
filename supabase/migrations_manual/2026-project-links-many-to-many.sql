-- Run this once in Supabase → SQL Editor → New query.
-- Adds many-to-many project links for boards/notes/resources, then drops
-- the old single project_id column each table had before.
--
-- NOTE: if you'd already linked any board/note/resource to a project using
-- the OLD single-project system, dropping project_id below will lose that
-- link (the row itself is untouched, just the link). Re-link it afterward
-- from the Project Details page's "Add inspiration board / note / resource"
-- if needed — this only matters if you'd actually used that feature already.

create table if not exists project_boards (
  project_id uuid not null references projects(id) on delete cascade,
  board_id uuid not null references inspiration_boards(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, board_id)
);
create table if not exists project_notes (
  project_id uuid not null references projects(id) on delete cascade,
  note_id uuid not null references notes(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, note_id)
);
create table if not exists project_resources (
  project_id uuid not null references projects(id) on delete cascade,
  resource_id uuid not null references resources(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, resource_id)
);

drop index if exists idx_inspiration_boards_project_id;
drop index if exists idx_notes_project_id;
drop index if exists idx_resources_project_id;
alter table inspiration_boards drop column if exists project_id;
alter table notes drop column if exists project_id;
alter table resources drop column if exists project_id;

create index if not exists idx_project_boards_board_id on project_boards(board_id);
create index if not exists idx_project_notes_note_id on project_notes(note_id);
create index if not exists idx_project_resources_resource_id on project_resources(resource_id);

-- Morrow — initial schema
-- Run once in the Supabase SQL editor (Project → SQL Editor → New query → paste → Run).
-- Matches docs/DATABASE.md, plus two columns already used by the app's types/UI
-- that weren't yet reflected in the doc: projects.category, resources.reading_minutes.

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- ============ projects ============
create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  cover_image_url text,
  description text,
  status text not null,
  deadline date,
  category text,
  tags text[] not null default '{}',
  external_links jsonb not null default '[]',
  notes text,
  is_archived boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============ inspiration_boards ============
create table inspiration_boards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  cover_image_url text,
  tags text[] not null default '{}',
  notes text,
  project_id uuid references projects(id) on delete set null,
  is_archived boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============ inspiration_references ============
create table inspiration_references (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references inspiration_boards(id) on delete cascade,
  image_url text not null,
  source_url text,
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- ============ notes ============
create table notes (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in
    ('text','checklist','bookmark','image','moodboard','code','quote','recipe','pdf','meeting')),
  title text not null,
  body text,
  items jsonb,
  url text,
  favicon_url text,
  domain text,
  snippet text,
  cover_image_url text,
  images text[],
  language text,
  code text,
  quote text,
  author text,
  ingredients text[],
  filename text,
  page_count int,
  attendees jsonb,
  agenda text[],
  project_id uuid references projects(id) on delete set null,
  is_archived boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============ resources ============
create table resources (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('link','repo','video','pdf','preview','image')),
  title text not null,
  url text not null,
  description text,
  tags text[] not null default '{}',
  reading_minutes int,
  owner text,
  repo_name text,
  language text,
  stars int,
  thumbnail_url text,
  duration text,
  filename text,
  page_count int,
  preview_image_url text,
  is_figma boolean not null default false,
  cover_image_url text,
  project_id uuid references projects(id) on delete set null,
  is_archived boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============ attachments ============
-- Created for schema completeness (docs/DATABASE.md); not wired to any app
-- code yet — real file uploads are a later phase.
create table attachments (
  id uuid primary key default gen_random_uuid(),
  parent_type text not null check (parent_type in ('project','inspiration_board')),
  parent_id uuid not null,
  storage_path text not null,
  file_size int not null,
  mime_type text not null check (mime_type in
    ('image/png','image/jpeg','image/webp','image/svg+xml','application/pdf')),
  created_at timestamptz not null default now()
);

-- ============ updated_at trigger ============
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_projects_updated_at before update on projects
  for each row execute function set_updated_at();
create trigger trg_inspiration_boards_updated_at before update on inspiration_boards
  for each row execute function set_updated_at();
create trigger trg_notes_updated_at before update on notes
  for each row execute function set_updated_at();
create trigger trg_resources_updated_at before update on resources
  for each row execute function set_updated_at();

-- ============ indexes ============
create index idx_inspiration_references_board_id on inspiration_references(board_id);
create index idx_inspiration_boards_project_id on inspiration_boards(project_id);
create index idx_notes_project_id on notes(project_id);
create index idx_resources_project_id on resources(project_id);
create index idx_projects_is_archived on projects(is_archived);
create index idx_inspiration_boards_is_archived on inspiration_boards(is_archived);
create index idx_notes_is_archived on notes(is_archived);
create index idx_resources_is_archived on resources(is_archived);

-- Search indexes (docs/DATABASE.md "Search" section)
create index idx_projects_search_title on projects using gin (title gin_trgm_ops);
create index idx_projects_search_description on projects using gin (description gin_trgm_ops);
create index idx_projects_search_notes on projects using gin (notes gin_trgm_ops);
create index idx_projects_search_tags on projects using gin (tags);

create index idx_inspiration_boards_search_title on inspiration_boards using gin (title gin_trgm_ops);
create index idx_inspiration_boards_search_notes on inspiration_boards using gin (notes gin_trgm_ops);
create index idx_inspiration_boards_search_tags on inspiration_boards using gin (tags);

create index idx_notes_search_title on notes using gin (title gin_trgm_ops);
create index idx_notes_search_body on notes using gin (body gin_trgm_ops);
create index idx_notes_search_snippet on notes using gin (snippet gin_trgm_ops);
create index idx_notes_search_quote on notes using gin (quote gin_trgm_ops);
create index idx_notes_search_ingredients on notes using gin (ingredients);
create index idx_notes_search_agenda on notes using gin (agenda);

create index idx_resources_search_title on resources using gin (title gin_trgm_ops);
create index idx_resources_search_description on resources using gin (description gin_trgm_ops);
create index idx_resources_search_tags on resources using gin (tags);

-- ============ archived_at (retention) ============
-- Idempotent — safe to re-run against a database created before this column
-- existed. Delete now soft-archives everywhere (is_archived = true); the
-- Archive screen purges anything archived_at more than 7 days ago.
alter table projects add column if not exists archived_at timestamptz;
alter table inspiration_boards add column if not exists archived_at timestamptz;
alter table notes add column if not exists archived_at timestamptz;
alter table resources add column if not exists archived_at timestamptz;

create index if not exists idx_projects_archived_at on projects(archived_at);
create index if not exists idx_inspiration_boards_archived_at on inspiration_boards(archived_at);
create index if not exists idx_notes_archived_at on notes(archived_at);
create index if not exists idx_resources_archived_at on resources(archived_at);

-- ============ project links (many-to-many) ============
-- A board/note/resource can appear on more than one Project Details page,
-- so these replace the old single nullable project_id column on each table.
create table project_boards (
  project_id uuid not null references projects(id) on delete cascade,
  board_id uuid not null references inspiration_boards(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, board_id)
);
create table project_notes (
  project_id uuid not null references projects(id) on delete cascade,
  note_id uuid not null references notes(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, note_id)
);
create table project_resources (
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

create index idx_project_boards_board_id on project_boards(board_id);
create index idx_project_notes_note_id on project_notes(note_id);
create index idx_project_resources_resource_id on project_resources(resource_id);

-- No RLS — single-user, anon-key app per docs/DATABASE.md "Access".

# Roadmap — Designer Workspace

Phases are sequential. Do not start a phase until the previous one works end-to-end.

## Phase 0 — Setup

- Repo scaffold: Vite + React + TypeScript + Tailwind + shadcn/ui
- Supabase project: Auth (email/password) + Postgres + Storage bucket
- Base layout, routing (React Router), design tokens/theme
- Deployed skeleton (empty dashboard behind login)

## Phase 1 — Core CRUD (the actual product)

- Auth: sign up / log in / log out; personal workspace auto-created per user
- Clients: create/edit/delete, list
- Projects: create/edit/delete, status, deadline, linked client
- Tasks: checklist per project (add/toggle/delete/reorder)
- Notes: free-text notes per project
- Attachments: add a link OR upload a small file (brief, screenshot, PDF) per project

## Phase 2 — Dashboard & Findability

- Dashboard: overview of all projects, grouped/sorted by status and upcoming deadline
- Search: across projects and clients
- Filters: by status, by client, by deadline range

## Phase 3 — Polish (per UX rules in CLAUDE.md)

- Empty states for every list (guide toward next action)
- Loading and error states designed intentionally (no generic spinners/blank screens)
- Keyboard shortcuts for high-frequency actions (new project, new task, search)
- Responsive pass, accessibility pass

## Phase 4 — Post-MVP (not started until MVP is validated)

- Multi-user workspaces & team collaboration (enabled by `workspaces`/`workspace_members` tables already in [DATABASE.md](DATABASE.md))
- Project templates (e.g. "Logo", "Brand Book", "Web Design")
- Deadline notifications/reminders
- Figma/Drive API integrations (auto-preview instead of manual links)
- Monetization/premium tier — architecture allows it, MVP does not implement it

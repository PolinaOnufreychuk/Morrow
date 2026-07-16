# Roadmap — Designer Workspace

Phases are sequential. Do not start a phase until the previous one works end-to-end.

## Phase 0 — Setup

- Repo scaffold: Vite + React + TypeScript + Tailwind + shadcn/ui
- Supabase project: Postgres + Storage bucket (no Auth — single-user app)
- Base layout, routing (React Router), design tokens/theme
- Deployed skeleton (empty dashboard)

## Phase 1 — Core CRUD (the actual product)

- Projects: create/edit/delete, search; fields per [FEATURES.md](FEATURES.md)
- Inspiration: create/edit/delete, search
- Notes: create/edit/delete, search
- Resources: create/edit/delete, search
- Attachments: optional lightweight file upload (PNG/JPG/WEBP/SVG/small PDF) on Projects and Inspiration only

## Phase 2 — Dashboard

- Recent Projects, Recent Inspiration, Recent Notes
- Quick Actions ("Create New...")
- No analytics, charts, statistics, or widgets

## Phase 3 — Polish (per UX rules in CLAUDE.md)

- Empty states with a clear next action for every list
- Loading and error states designed intentionally (no generic spinners/blank screens)
- Keyboard shortcuts for high-frequency actions (new project, new note, focus search)
- Responsive pass, accessibility pass

## Not Planned

The MVP scope update explicitly excludes the following — they are not deferred to a later phase, they are simply out of scope: multi-user/teams/roles, authentication, payments/subscriptions, global search, favorites, advanced filtering, light theme, deadlines/calendar, CRM features, time tracking, analytics, drag & drop, full file storage, real-time collaboration.

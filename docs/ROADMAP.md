# Roadmap — Morrow

Phases are sequential. Do not start a phase until the previous one works end-to-end.

## Phase 0 — Setup

- Repo scaffold: Vite + React + TypeScript + Tailwind + shadcn/ui
- Supabase project: Postgres + Storage bucket (no Auth — single-user app)
- Base layout, routing (React Router)

## Phase 0.5 — Design System Foundation

Every later phase depends on reusing these rather than inventing per-screen styles — see [DESIGN.md](DESIGN.md).

- Spacing, typography, and color tokens sourced from the `morrow/` brand assets (logo, 3D illustrations, photography, branded greens, warm backgrounds)
- Base button components: primary CTA (dark green) and secondary, consistent rounded-rectangle radius, never fully rounded
- Base modal pattern: close (X) icon with subtle light-gray background, no redundant Cancel
- Base card components per content type (Project, Inspiration board, Note, Resource) — built once, reused everywhere

## Phase 1 — Core CRUD (the actual product)

- Projects: create/edit/delete, search; fields per [FEATURES.md](FEATURES.md), including the manual deadline field
- Inspiration: boards (create/edit/delete, search) + references within a board (add/remove, multi-select)
- Notes: create/edit/delete, search, across the 8 visual content types; modal-based editing; three-dot action menu
- Resources: create/edit/delete, search
- Attachments: optional lightweight file upload (PNG/JPG/WEBP/SVG/small PDF) on Projects and Inspiration boards only

## Phase 2 — Project Details (flagship screen)

Given extra polish investment as one of the platform's primary experiences (see [DESIGN.md](DESIGN.md)):

- Hero image (smaller), tags overlaid on top of the image, menu button positioned on the image
- Sticky info sidebar, content split into clear visual sections
- Editable Linear-inspired interactive tag metadata
- Embedded Inspiration board / Notes / Resource cards for content scoped to the project (via `project_id`), reusing each module's native card component

## Phase 3 — Dashboard

- Recent Projects, Recent Inspiration, Recent Notes
- Quick Actions ("Create New...")
- No analytics, charts, statistics, or widgets

## Phase 4 — Archive

- Soft-delete (`is_archived`) across Projects, Inspiration boards, Notes, Resources
- Unified archive card style with a type badge/metadata, reachable from a lightweight lower-sidebar nav item

## Phase 5 — Polish

- Empty states with a clear next action for every list
- Loading and error states designed intentionally (no generic spinners/blank screens)
- Fullscreen reference viewer polish (blurred background, image navigation, close interaction)
- Responsive pass, accessibility pass
- Full visual-parity pass against [DESIGN.md](DESIGN.md)

## Not Planned

Explicitly out of scope, not deferred: user profiles, team collaboration, notifications, permissions, workspace switching, account settings, keyboard shortcuts, help center, sign out flow, multi-user onboarding, payments/subscriptions, global search, favorites, advanced filtering, light theme, calendar UI, CRM features, time tracking, analytics, drag & drop, full file storage, real-time collaboration.

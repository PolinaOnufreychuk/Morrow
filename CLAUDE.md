# Designer Workspace

A personal creative workspace for a solo UI/UX designer — a single place for projects, inspiration, notes, and resources, instead of scattering context across Figma/Drive/chats/notes. Built primarily for learning modern web development and for the designer's own daily workflow. No code written yet.

## Confirmed MVP Decisions

- **User**: single UI/UX designer, personal use only. No authentication, no login screen — the app assumes exactly one user.
- **Platform**: web app (responsive SPA).
- **Modules**: Dashboard, Projects, Inspiration, Notes, Resources (see [docs/FEATURES.md](docs/FEATURES.md) for fields/behavior of each).
- **Files**: link-first. External links are the primary way of storing resources/inspiration. Optional lightweight attachments (PNG, JPG, WEBP, SVG, small PDF) for extra context on Projects and Inspiration only — this is not a file storage service.
- **Search**: local search inside each module only (matches title/description/notes/tags). No global cross-module search.
- **Tags**: supported only on Projects, Inspiration, Resources, for organization; search automatically includes tags; no dedicated tag-filter UI.
- **Approved stack**: React + TypeScript + Vite, Tailwind CSS, shadcn/ui, React Router, TanStack Query, React Hook Form + Zod, Supabase — **Postgres + Storage only, no Supabase Auth** (see [docs/DATABASE.md](docs/DATABASE.md)).
- **Code style priority**: clarity, readability, and maintainability over cleverness or premature optimization. Keep every feature as simple as possible; do not introduce unnecessary complexity. Codebase should be educational, well-structured, easy to understand.

## Explicitly Out of Scope (MVP)

Multi-user support, teams/workspaces, roles and permissions, authentication, payments/subscriptions, global search, favorites, advanced filtering, light theme, deadlines, calendar, CRM features, time tracking, analytics, drag & drop, full file storage service, real-time collaboration.

## Project Docs

- [docs/PRODUCT.md](docs/PRODUCT.md) — problem, target user, value proposition, scope boundaries
- [docs/ROADMAP.md](docs/ROADMAP.md) — phased build plan
- [docs/DATABASE.md](docs/DATABASE.md) — schema, storage design
- [docs/FEATURES.md](docs/FEATURES.md) — feature list by module

## Working Mode

Before writing any implementation code, act as Product Architect / Senior Software Engineer:
1. Analyze the product idea.
2. Identify core purpose.
3. Propose MVP scope.
4. Define main modules.
5. Propose scalable architecture.
6. List technical risks.
7. Suggest improvements.
8. Ask clarifying questions when something is ambiguous.

Only move to implementation after architecture is discussed and approved.

## Philosophy

Every feature must solve a real problem encountered during daily design work. Avoid adding functionality that is not explicitly scoped for the MVP.

## Core Principles

- Simplicity over complexity; fast interactions; minimal cognitive load.
- Consistent design language; reusable UI components; responsive by default.
- Accessibility considered from the start.
- Every screen has one clear primary action.
- Build only what supports the designer's workflow — avoid unnecessary features.

## UX Rules

- Never more than 3 clicks to reach important information.
- Prioritize keyboard shortcuts where appropriate.
- Progressive disclosure instead of cluttered interfaces.
- Every list supports search and filtering.
- Empty states guide users toward the next action.
- Loading and error states are intentionally designed, not default/generic.

## Development Rules

- Build reusable components; avoid duplicated logic.
- Prefer composition over large monolithic components.
- Keep the codebase modular and scalable.
- Prioritize readability over cleverness.
- Every new feature integrates naturally into the existing design system.
- Focus on delivering a polished, production-quality MVP rather than more features.

# Designer Workspace

A hub for a solo freelance designer to organize client projects in one place (status, files/links, tasks, deadlines, client info) instead of scattering context across Figma/Drive/chats/notes. Brand-new project — no code written yet.

## Confirmed MVP Decisions

- **User**: solo freelance designer (not a team — but data model should allow multi-user later without painful migration, e.g. `owner_id` on projects).
- **Platform**: web app (responsive SPA).
- **Files**: hybrid — mostly links out to external tools (Figma, Drive, Dropbox) + light attachments hosted in-app (briefs, screenshots, PDFs, size-limited). No full asset hosting/versioning in MVP.
- **MVP modules**: Projects (CRUD, status, deadline, client), Tasks/checklist per project, Notes, Attachments (link or file), Clients, Dashboard (overview across projects), Search/filter.
- **Out of scope for v1**: real file hosting/versioning, team/multi-user permissions, time tracking, invoicing, native Figma/Drive API integrations (manual links only), mobile app.
- **Approved stack**: React + TypeScript + Vite, Tailwind CSS, shadcn/ui, React Router, TanStack Query, React Hook Form + Zod, Supabase (Auth, Postgres, Storage).
- **Teams/monetization**: not in MVP. Data model must allow adding workspaces/collaboration later without a rearchitecture (see [docs/DATABASE.md](docs/DATABASE.md)). Monetization has zero influence on MVP implementation.
- **Code style priority**: clarity and maintainability over premature optimization. Codebase should be educational, well-structured, easy to understand — prefer widely-adopted libraries/patterns over niche or overly clever ones.

## Project Docs

- [docs/PRODUCT.md](docs/PRODUCT.md) — problem, target user, value proposition, scope boundaries
- [docs/ROADMAP.md](docs/ROADMAP.md) — phased build plan (MVP → post-MVP)
- [docs/DATABASE.md](docs/DATABASE.md) — schema, RLS, storage design
- [docs/FEATURES.md](docs/FEATURES.md) — feature list by module, MVP vs later

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

Every feature must solve a real problem encountered during daily design work.

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
- Every new feature integrates naturally into the existing design system.

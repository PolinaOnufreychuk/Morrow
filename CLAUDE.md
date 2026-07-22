# Morrow

A personal creative workspace for a solo UI/UX designer — a single place for projects, inspiration, notes, and resources, instead of scattering context across Figma/Drive/chats/notes. Built primarily for learning modern web development and for the designer's own daily workflow. No code written yet.

Brand assets (logo in black/color/white, 3D illustrations, photography) live in `morrow/` at the repo root — use them intentionally. The interface should feel premium, calm, and creative, never flat or corporate. See [docs/DESIGN.md](docs/DESIGN.md) for the full visual/interaction rulebook.

## Confirmed MVP Decisions

- **User**: single UI/UX designer, personal use only. No authentication, no login screen — the app assumes exactly one user.
- **Platform**: web app (responsive SPA).
- **Modules**: Dashboard, Projects, Inspiration (boards), Notes (typed), Resources, Archive (see [docs/FEATURES.md](docs/FEATURES.md) for fields/behavior of each).
- **Inspiration** is organized as boards (not flat items) — each board holds multiple image references with a fullscreen viewer.
- **Notes** have 8 visual content types (Text, To-Do, Checklist, Idea, Meeting, Research, Code Snippet, Bookmark), picked visually on creation, edited in modals.
- **Projects** have a manual deadline field (date only — no calendar UI) and are the platform's flagship screen (see [docs/DESIGN.md](docs/DESIGN.md)).
- **Archive** replaces the sidebar's old account-section slot (a lightweight lower-nav item) — Projects/Boards/Notes/Resources can be archived and appear there in one unified card style, disambiguated by badge.
- **Files**: link-first. External links are the primary way of storing resources/inspiration. Optional lightweight attachments (PNG, JPG, WEBP, SVG, small PDF) for extra context on Projects and Inspiration boards only — this is not a file storage service.
- **Search**: local search inside each module (matches title/description/notes/tags), plus a global search reachable from the Dashboard's search bar — pressing Enter navigates to a dedicated Search Results page (`/search`) matching across all modules at once, grouped by module with tab filters and result counts, reusing each module's existing card component.
- **Tags**: supported only on Projects, Inspiration, Resources, for organization; search automatically includes tags; no dedicated tag-filter UI.
- **Approved stack**: React + TypeScript + Vite, Tailwind CSS, shadcn/ui, React Router, TanStack Query, React Hook Form + Zod, Supabase — **Postgres + Storage only, no Supabase Auth** (see [docs/DATABASE.md](docs/DATABASE.md)).
- **Code style priority**: clarity, readability, and maintainability over cleverness or premature optimization. Keep every feature as simple as possible; do not introduce unnecessary complexity. Codebase should be educational, well-structured, easy to understand.

## Current Product Scope — do NOT introduce

User profiles, team collaboration, notifications, permissions, workspace switching, account settings, keyboard shortcuts, help center, sign out flow, onboarding flows for multiple users. Also excluded: payments/subscriptions, favorites, advanced filtering, light theme, calendar UI, CRM features, time tracking, analytics, full file storage service, real-time collaboration.

These may be introduced later but must not influence current design or implementation.

**Approved exception**: drag & drop is otherwise out of scope, except for the sidebar's single pin-by-dragging interaction (drag a card from a Projects/Inspiration/Notes/Resources listing page onto the sidebar's Pinned slot) — see [docs/FEATURES.md](docs/FEATURES.md). This does not extend to reordering, multi-select drag, or file-management drag & drop.

## Project Docs

- [docs/PRODUCT.md](docs/PRODUCT.md) — problem, target user, value proposition, scope boundaries
- [docs/DESIGN.md](docs/DESIGN.md) — visual design system: philosophy, brand identity, buttons, modals, cards, per-screen UX patterns
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

Every feature must solve a real problem encountered during daily design work. Avoid adding functionality that is not explicitly scoped for the MVP. Prefer the simpler, more intentional solution over generic SaaS functionality — consistency across the platform matters more than new visual ideas.

## Core Principles

- Simplicity over complexity; fast interactions; minimal cognitive load.
- Consistent design language; reusable UI components; responsive by default.
- Accessibility considered from the start.
- Every screen has one clear primary action.
- Build only what supports the designer's workflow — avoid unnecessary features.
- Never introduce a new UI component unless it solves a real UX problem.

## UX Rules

- Never more than 3 clicks to reach important information.
- Prioritize keyboard shortcuts where appropriate.
- Progressive disclosure instead of cluttered interfaces.
- Every list supports search and filtering.
- Empty states guide users toward the next action.
- Loading and error states are intentionally designed, not default/generic.

## Development Rules

- Build reusable components; avoid duplicated logic or UI.
- Prefer composition over large monolithic components.
- Keep the codebase modular and scalable.
- Prioritize readability over cleverness.
- Avoid hardcoded styling — use the design system's tokens/components.
- Preserve design accuracy over implementation speed; maintain visual parity with the approved design in [docs/DESIGN.md](docs/DESIGN.md).
- When unsure about a UI decision, prefer consistency with an existing component over inventing something new.
- Every new feature integrates naturally into the existing design system.
- Focus on delivering a polished, production-quality MVP rather than more features.

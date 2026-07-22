# Features — Morrow

Grouped by module. All items below are MVP, see [ROADMAP.md](ROADMAP.md) for build order. Visual/interaction details for each module live in [DESIGN.md](DESIGN.md).

## Dashboard

Purpose: quick overview of the workspace.

Content:
- Recent Projects
- Recent Inspiration
- Recent Notes
- Quick Actions ("Create New...")

No analytics, charts, statistics, or widgets.

## Projects

Fields: Title, Cover Image, Description, Status, Deadline (manual, date only), Tags, External Links (Figma, GitHub, Demo, etc.), Notes, optional lightweight Attachments.

Features: Create, Edit, Delete, Search (matches title, description, notes, tags).

**Project Details is a flagship screen** (see [DESIGN.md](DESIGN.md)): smaller hero image with tags overlaid on top and a menu button positioned on the image, sticky info sidebar, content split into clear sections, editable Linear-style interactive tag metadata, and embedded Inspiration board / Notes / Resource cards (reusing each module's native card, not simplified placeholders) for content scoped to that project.

No calendar UI or full project-management features — the deadline is a single manual field.

## Inspiration

Organized as **boards** (not flat items) — a board is the primary visual object.

Board fields: Title, Cover Image, Tags, Notes.
Reference fields (per image within a board): Image, Source URL (optional).

Features: Create/Edit/Delete boards, Search (matches board title, notes, tags); add/remove references within a board; multi-select references for bulk actions during board editing.

Reference viewing: fullscreen preview with blurred background, image navigation between references, close interaction.

Board cards always preserve their visual identity — never downgraded to a plain list row.

## Notes

Notes are designed around 10 visual content types, picked via a visual (icon/preview-driven) type picker at creation — not a plain text-only list:

- Text — free-text body
- Checklist — checkable items list
- Bookmark — URL + favicon + domain + snippet
- Image — a cover image
- Moodboard — a 2×2 grid of 4 images
- Code Snippet — language + monospace code block
- Quote — quote text + author (Canela italic treatment)
- Recipe — bulleted ingredient list
- PDF — filename + page count
- Meeting Notes — attendee avatars + bulleted agenda

Fields: Title, plus the type-specific content listed above (see [docs/DATABASE.md](DATABASE.md) for the exact schema).

Features: Create, Edit, Delete, Search (matches title and content). Editing happens inside modals; a three-dot menu exposes note actions (edit, delete, archive).

## Resources

Fields: Title, URL, Short Description, Tags, plus a `kind` that determines the card's visual treatment:

- Link — plain title + description, no media
- Repo (GitHub) — owner/repo, language, star count
- Video (YouTube) — thumbnail with play overlay, duration
- PDF — filename
- Preview — generic embed preview, or a Figma-specific tile when the link is a Figma file
- Image — a cover image

Features: Create, Edit, Delete, Search (matches title, description, tags).

No fixed categories — tags are used for organization instead; `kind` only drives card layout, not filtering.

## Sidebar Pinning

The sidebar holds a single pinned item — any one Project, Inspiration board, Note, or Resource — rendered with that module's own card component at a smaller size, so it always stays visually consistent with the rest of the app.

- Pin by dragging a card from the Projects, Inspiration, Notes, or Resources listing page onto the sidebar's Pinned slot; dropping a new card replaces whatever was pinned before (only one pinned item at a time).
- The sidebar reveals an empty dashed drop placeholder only while a card from one of those four listing pages is being dragged — not from the Dashboard.
- Clicking the pinned card navigates to (or opens) the same destination its full-size card would.
- Unpin via the pinned card's three-dot menu ("Unpin") — the same overflow-menu pattern used everywhere else.
- Pinning is in-memory only (like the rest of the app's demo data) — it resets on reload.

## Archive

Replaces the old (never-built) account section in the sidebar — appears as a lightweight nav item in the lower sidebar.

- Projects, Inspiration Boards, Notes, and Resources can each be archived (soft-delete).
- One unified archive card style regardless of source type — the type is shown via a badge/metadata, not a different layout.
- No profile section, settings page, or authentication flow exist alongside it.

## Search

Each module supports its own local search (matches the fields listed above). In addition, the Dashboard's search bar is a global search: pressing Enter navigates to a dedicated Search Results page (`/search?q=...`) that matches across Projects, Inspiration, Notes, and Resources at once, grouped by module with a tab-based filter (All / Projects / Inspiration / Notes / Resources, each showing a result count) and no separate filter icon. Results reuse each module's existing card component — no separate search-result card design.

## Tags

Supported only in Projects, Inspiration boards, Resources. Used for organization; automatically included in each module's search. No separate tag-filtering UI. On Project Details, tags render as editable interactive chips (Linear-inspired).

## File Handling

Link-first: external links are the primary way of storing resources/inspiration. Optional lightweight attachments (PNG, JPG, WEBP, SVG, small PDF) supported only for additional context, only on Projects and Inspiration boards. Not a file storage service.

## Authentication

None. Single-user application, no login.

## Current Product Scope — Excluded from MVP

User profiles, team collaboration, notifications, permissions, workspace switching, account settings, keyboard shortcuts, help center, sign out flow, onboarding flows for multiple users, payments or subscriptions, favorites, advanced filtering, light theme, calendar UI, CRM features, time tracking, analytics, full file storage, real-time collaboration. Drag & drop is out of scope beyond the sidebar pin-by-dragging interaction described under Sidebar Pinning above.

These may be introduced later but should not influence current design or implementation.

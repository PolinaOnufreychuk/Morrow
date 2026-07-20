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

Notes are designed around 8 visual content types, picked via a visual (icon/preview-driven) type picker at creation — not a plain text-only list:

- 📝 Text Note
- ✅ To-Do List
- ☑️ Checklist
- 💡 Idea
- 🎯 Meeting Notes
- 📚 Research Notes
- 💻 Code Snippet
- 🔗 Bookmark

Fields: Title, plus type-specific content (free text for Text/Idea/Meeting/Research/Code; checkable items for To-Do/Checklist; a URL for Bookmark).

Features: Create, Edit, Delete, Search (matches title and content). Editing happens inside modals; a three-dot menu exposes note actions (edit, delete, archive).

## Resources

Fields: Title, URL, Short Description, Tags.

Features: Create, Edit, Delete, Search (matches title, description, tags).

No fixed categories — tags are used for organization instead.

## Archive

Replaces the old (never-built) account section in the sidebar — appears as a lightweight nav item in the lower sidebar.

- Projects, Inspiration Boards, Notes, and Resources can each be archived (soft-delete).
- One unified archive card style regardless of source type — the type is shown via a badge/metadata, not a different layout.
- No profile section, settings page, or authentication flow exist alongside it.

## Search

Local search inside each module only. No global search.

## Tags

Supported only in Projects, Inspiration boards, Resources. Used for organization; automatically included in each module's search. No separate tag-filtering UI. On Project Details, tags render as editable interactive chips (Linear-inspired).

## File Handling

Link-first: external links are the primary way of storing resources/inspiration. Optional lightweight attachments (PNG, JPG, WEBP, SVG, small PDF) supported only for additional context, only on Projects and Inspiration boards. Not a file storage service.

## Authentication

None. Single-user application, no login.

## Current Product Scope — Excluded from MVP

User profiles, team collaboration, notifications, permissions, workspace switching, account settings, keyboard shortcuts, help center, sign out flow, onboarding flows for multiple users, payments or subscriptions, global search, favorites, advanced filtering, light theme, calendar UI, CRM features, time tracking, analytics, drag & drop, full file storage, real-time collaboration.

These may be introduced later but should not influence current design or implementation.

# Features — Designer Workspace

Grouped by module. All items below are MVP — this scope is intentionally small and flat, see [ROADMAP.md](ROADMAP.md) for build order.

## Dashboard

Purpose: quick overview of the workspace.

Content:
- Recent Projects
- Recent Inspiration
- Recent Notes
- Quick Actions ("Create New...")

No analytics, charts, statistics, or widgets.

## Projects

Fields: Title, Cover Image, Description, Status, Tags, External Links (Figma, GitHub, Demo, etc.), Notes, optional lightweight Attachments.

Features: Create, Edit, Delete, Search (matches title, description, notes, tags).

No deadlines, calendars, or project management features.

## Inspiration

Fields: Title, URL, Cover Image/Preview, Tags, Notes, optional lightweight Attachments.

Features: Create, Edit, Delete, Search (matches title, notes, tags).

## Notes

Fields: Title, Text.

Features: Create, Edit, Delete, Search (matches title, text).

No folders, markdown editor, formatting tools, or attachments.

## Resources

Fields: Title, URL, Short Description, Tags.

Features: Create, Edit, Delete, Search (matches title, description, tags).

No fixed categories — tags are used for organization instead.

## Search

Local search inside each module only. No global search.

## Tags

Supported only in Projects, Inspiration, Resources. Used for organization; automatically included in each module's search. No separate tag-filtering UI.

## File Handling

Link-first: external links are the primary way of storing resources. Optional lightweight attachments (PNG, JPG, WEBP, SVG, small PDF) supported only for additional context, only on Projects and Inspiration. Not a file storage service.

## Authentication

None. Single-user application, no login.

## Excluded from MVP

Multi-user support, teams or workspaces, roles and permissions, authentication, payments or subscriptions, global search, favorites, advanced filtering, light theme, deadlines, calendar, CRM features, time tracking, analytics, drag & drop, full file storage, real-time collaboration.

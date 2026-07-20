# Design System — Morrow

This is the finalized visual/interaction rulebook. Treat it as source of truth for every screen — see [../CLAUDE.md](../CLAUDE.md) for product scope and [FEATURES.md](FEATURES.md) for module-level behavior.

## General Design Philosophy

- Personal-first, not a multi-user SaaS at this stage.
- When choosing between generic SaaS functionality and a focused, intentional solution, always pick the simpler, more intentional one.
- The interface should feel premium, highly polished, calm, and creative — not enterprise or dashboard-heavy.
- Every screen should look intentionally designed, never generated from generic UI patterns.
- Never introduce a new UI component unless it solves a real UX problem.
- Consistency across the platform matters more than adding new visual ideas.

## Design Language

- Use the existing design system as the foundation; reuse existing components whenever possible.
- Create new components only if absolutely necessary.
- Maintain identical spacing logic, typography hierarchy, color usage, border radius, shadows, and interaction patterns across every screen.
- No random new styles. Every new screen should feel like it belongs to the same product.

## Brand Identity

- Brand assets live in `morrow/` at the repo root: logo (black/color/white variants, PNG+SVG), custom 3D illustrations, photography.
- The platform has branded greens, warm backgrounds, and visual depth — avoid overusing neutral gray UI.
- Use illustrations, photography, and color intentionally. The interface should never feel flat or overly corporate.

## Buttons

- One consistent system across the whole platform.
- **Primary CTA**: dark green, same color everywhere, same corner radius everywhere.
- **Secondary buttons**: subtle, neutral, never compete visually with the primary CTA.
- Buttons are never fully rounded — all controls use rounded rectangles with a consistent corner radius.

## Modals

- One interaction pattern for every modal.
- Always include a close icon (X).
- Never include a redundant Cancel button if a close icon already exists.
- The close button has a subtle light-gray circular/square background — never a bare floating icon.

## Cards

- Cards never feel like generic placeholders.
- Wherever content already has an existing card design elsewhere in the product, reuse that exact design instead of creating a simplified version.
- Example: the Project Details page reuses Inspiration board cards, Notes cards, and Resource cards for its embedded content — it does not invent simplified white placeholders.

## Project Details Page

One of the platform's primary experiences — treat it as a premium workspace, not a standard detail page. It should remain one of the highest-quality screens in the app.

- Smaller hero image, with tags placed on top of the image and the menu button positioned on the image.
- Sticky information sidebar.
- Content divided into clear visual sections.
- Editable metadata using Linear-inspired interactive tags.
- Manual project deadline field (date only, no calendar UI).
- Reusable content cards (see Cards above) for embedded Inspiration/Notes/Resources.
- Richer visual hierarchy, polished spacing, stronger typography than other screens.

## Inspiration

Visual-first experience. Boards are the primary visual object.

- Board cards always preserve their visual identity — never downgraded to a generic list row.
- Reference viewing supports: fullscreen preview, blurred background, image navigation, close interaction.
- Board editing supports multi-selection (select multiple references at once for bulk actions).

## Notes

Notes are designed around different content types (see [FEATURES.md](FEATURES.md) for the full list).

- Editing happens inside modals (see Modals above).
- Three-dot menus expose note actions.
- Type selection at creation time is visual — icon/preview-driven, not a plain text-only list of options.

## Archive

- Archive replaces the old account-section slot in the sidebar. There is currently no profile section, no settings page, no authentication flow.
- Appears as a lightweight navigation item in the lower sidebar.
- Uses one unified archive card style regardless of the original content type (Project, Inspiration Board, Note, or Resource).
- The archived item's origin type is shown via a badge/metadata, not a completely different card layout.

## Development Principles

- Preserve design accuracy over implementation speed.
- Build reusable components; avoid duplicated UI and hardcoded styling.
- Keep components modular and layouts responsive.
- Follow accessibility best practices.
- Maintain visual parity with this approved design.
- When unsure about a UI decision, prefer consistency with an existing component over inventing something new.

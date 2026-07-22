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

## Design Tokens (exact values)

Extracted from the approved hi-fi export (`designer-workspace-wireframes/project/Dashboard.dc.html` + its design-system bundle). These are the literal values `tailwind.config.ts` and `src/design-system/tokens/*.css` must encode — this section supersedes any general color/spacing prose elsewhere in this file if the two ever disagree.

**Radius family** (law — no pill/fully-rounded controls anywhere except tiny status dots and progress bars): cards `20px`; card inner images `14px` (`10px` in the sidebar-pinned variant); search field `16px`; buttons/CTAs `12–14px`; tab container `13px` / tab buttons `9px`; small chips/badges `8px`; nav items `13px`; avatar tile `12px`.

**Colors** (base palette from the design-system token file, with the hi-fi build's page-level overrides applied — the overrides win):
```
sage-100 #EEF1EA   sage-200 #D3DAA7   sage-300 #B4C09C   sage-400 #8FA987
sage-500 #748C5A   sage-600 #6B8C6D   sage-700 #557057   sage-900 #2F4635
blush-100 #FBF0F0  blush-200 #EFC7CF  blush-300 #DAB0BC  blush-400 #D8A5A1  blush-600 #BF6968
cream-50 #FBFAF8   cream-100 #F2F2F2  cream-200 #EEEAE6
warm-300 #CAC9C7   warm-500 #9A9793
ink-700 #4A4B45    ink-900 #242621

surface-page = cream-50        surface-card = #FFFFFF        surface-dark = sage-900
text-primary = ink-900
text-secondary = #4B473E   (override — base token was ink-700 #4A4B45; the hi-fi build darkens it for contrast, use the override)
text-tertiary  = #6E695F   (override — base token was warm-500 #9A9793)
border-subtle  = rgba(36,38,33,.09)   (override — base token was a color-mix())
border-default = warm-300
brand-primary = sage-600 · brand-primary-hover = sage-700 · accent-coral = blush-600
focus-ring = color-mix(in oklch, sage-600 55%, transparent)
```
Primary CTA is always `sage-900 #2F4635`. Interface stays mostly neutral; imagery is the main color source; blush/coral accents are sparse.

**Typography**: display font is **Canela** (Thin 200 / Light 300, + italics only — no regular/medium/bold faces exist), used only for large headlines and rare italic accent moments. UI/body font is **Helvetica Neue Cyr** (not Satoshi — Satoshi was superseded by explicit decision during the hi-fi pass), loaded from `.woff2` files, weights 300/400/500/700 + italics. Body stack: `'HelveticaNeueCyr','Helvetica Neue',Helvetica,sans-serif`. UI weights are 400/500 only; 700 is reserved for tiny uppercase eyebrow labels (`10.5px`, `700`, letter-spacing `.12–.13em`, uppercase). Headings use `text-wrap:balance/pretty` to avoid widows.

**Spacing scale**: `4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128px`.

**Glassmorphism** (every floating surface is translucent glass over the photographic/warm background): sidebar `rgba(247,246,243,.52)` + `blur(28px) saturate(1.25)`; cards `rgba(255,255,255,.55–.6)` + `blur(16–20px)`; search/tabs/sort controls `~.42–.55` white + blur. Borders: `1px rgba(255,255,255,.5–.65)` only — never dark outlines. Inner top highlight: `inset 0 1px 0 rgba(255,255,255,.55–.6)`. Shadows: soft, warm, layered — `0 16px 40px -18px hsl(30 25% 20% / .16)`, deepening on hover to `0 26px 56px -18px hsl(30 25% 20% / .2)` — never heavy or pure black. Blur applies only inside panels; a background photo itself is never blurred.

> **Exception — panel edges over flat backgrounds.** A pure-white glass border nearly vanishes where the surface behind it is the flat cream `surface-page` (`#FBFAF8`) rather than the Dashboard photo — e.g. the sidebar's right edge on every non-Dashboard route. There, the white highlight may be paired with a companion `border-subtle` (`rgba(36,38,33,.09)`) hairline + a soft `hsl(30 25% 20% / .16)` shadow (the app's one shadow hue) so the seam stays visible on both background types. This is the only sanctioned dark edge; it is a low-alpha companion to the white highlight, not a replacement for it, and does not license dark outlines on cards/controls.

**Motion**: `ease-breath: cubic-bezier(.34,.02,.28,1)` (panel/width transitions), `ease-out: cubic-bezier(.16,1,.3,1)` (hover/press). Durations: `160ms` fast, `360ms` medium, `720ms` slow. Hover = opacity/fill increase + 1px lift (`translateY(-1px)` on controls, `-3px` on cards) — never bounce, never color inversion.

**One real responsive breakpoint**: `1180px` — below it, masonry grids drop from 3 to 2 columns. This is a desktop-first product; no dedicated mobile/tablet layout is in scope for MVP.

## Buttons

- One consistent system across the whole platform.
- **Primary CTA**: dark green (`sage-900 #2F4635`), same color everywhere, same corner radius everywhere.
- **Secondary buttons**: subtle, neutral, never compete visually with the primary CTA.
- Buttons are never fully rounded — all controls use rounded rectangles with a consistent corner radius (see Design Tokens above).

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

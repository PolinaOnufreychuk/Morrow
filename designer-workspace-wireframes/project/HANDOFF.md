# Morrow Dashboard — Project Handoff Summary

> Continuation document for the Morrow Designer Workspace project. Written for a new Claude conversation (or a senior product designer) to continue without context loss.
> Key files: `Dashboard.dc.html` (the hi-fi deliverable), `Wireframes.dc.html` (approved UX blueprint — do not modify), `Sidebar.dc.html` (early sidebar exploration, superseded).

---

## 1. Project Overview

**Product:** Morrow — a mindful digital workspace for UI/UX designers. A calm, editorial daily dashboard replacing scattered tools (Figma links, mood boards, sticky notes, bookmarks) with one home for four modules: **Projects, Inspiration, Notes, Resources**.

**Audience:** designers and creatives; the product must feel like a premium creative workspace, never generic SaaS or productivity software.

**Vision / philosophy:** calm, editorial, premium, minimal, highly crafted, spacious. Feeling positioned between Notion, Linear, Arc Browser, Read.cv, Pinterest, and Apple. "Beautifully designed creative workspace" should be the 1-second first impression.

**Process status:** wireframe/UX phase is FINISHED and APPROVED (`Wireframes.dc.html`). All work since is visual refinement only — layout, flows, and interactions are locked. The user explicitly forbids UX redesigns.

## 2. Design System

Bound system: **Morrow Design System** at `_ds/morrow-design-system-ba8ef2a2-ce09-4c87-88de-c05a4e43b774/` (tokens + `_ds_bundle.js` loaded in helmet). Source tree: `/projects/ba8ef2a2-ce09-4c87-88de-c05a4e43b774/`.

**Typography**
- Display: **Canela** (Thin/Light + italics only — trial license) via `var(--font-display)`. Used ONLY for large headlines and special editorial moments (hero greeting, Note card title).
- UI/body: **Helvetica Neue Cyr** (user-supplied, replaces Satoshi per user decision). Loaded via `@font-face` in the helmet from `uploads/font/HelveticaNeueCyr-{Light,Roman,Medium,Bold}.woff2` (+Italic), weights 300/400/500/700. Body font-family: `'HelveticaNeueCyr','Helvetica Neue',Helvetica,var(--font-body),sans-serif`.
- Weight rules: UI uses 400/500 (600 was globally replaced with 500 — HN Medium reads premium). 700 only for tiny uppercase eyebrows.
- Italic rule: Canela italic is the emotional accent — exactly one or two words. In the hero it is the user's NAME: "Good morning, *Jordan*" (user corrected from italicizing "morning").
- Hierarchy ladder (must stay distinct even in grayscale): main heading (Canela ~clamp(40–58px) weight 300) → section titles → card titles (15.5–16.5px / 500) → body (12.5–13.5px) → button labels (13px) → metadata (11–12px).
- Eyebrows: 10.5px, 700, letter-spacing .12–.13em, uppercase.
- Optical centering: interactive labels carry `line-height:1`–`1.25`; controls should feel lightweight, never competing with content.
- `text-wrap: balance/pretty` on headings/subtitles to prevent widows (hero subtitle max-width ~380–600px; user tweaked to 600px via editor — respect their direct edits).

**Color**
- Palette: sage greens (`--brand-primary` #6B8C6D family, `--sage-*`), dusty blush (`--blush-*`, #BF6968 coral for rare accents), warm creams, deep forest ink `--sage-900`/#2F4635, `--ink-900`.
- Interface stays mostly neutral; imagery is the main color source. Accents sparse and dusted, nothing saturated or loud.
- Readability overrides added in helmet `:root`: `--text-secondary:#4B473E; --text-tertiary:#6E695F; --border-subtle:rgba(36,38,33,.09)` — contrast used intentionally as hierarchy (user complained about washed-out grays).

**Geometry (radius family — ONE shape language, no pills)**
- Cards 20px; card inner images 14px (10px in sidebar pinned); search 16px; buttons/CTAs 12–14px; tab container 13px, tab buttons 9px; small chips/badges 8px; nav items 13px; avatar tile 12px. Fully-round pills are banned (user rejected capsule chips twice); only tiny status dots and progress bars are rounded-full.

**Glassmorphism (established rules)**
- Every floating surface is translucent glass over the photographic background: sidebar `rgba(247,246,243,.52)` + `blur(28px) saturate(1.25)`; cards `rgba(255,255,255,.55–.6)` + `blur(16–20px)`; search/tabs/sort ~`.42–.55` white + blur.
- Borders: delicate `1px rgba(255,255,255,.5–.65)` — NEVER dark outlines (user removed `rgba(36,38,33,.2)` borders).
- Inner light: `box-shadow: inset 0 1px 0 rgba(255,255,255,.55–.6)` on glass surfaces.
- Shadows: soft, layered, warm, almost invisible — e.g. `0 16px 40px -18px hsl(30 25% 20% / .16)`; hover deepens to `0 26px 56px -18px / .2`. Never heavy or pure black.
- Blur only inside panels; the background image itself is never blurred.

**Interaction**
- Hover: opacity/fill increase + 1px lift (`translateY(-1px)` controls, `-3px` cards), slow eases (`--ease-out`, `--ease-breath`, .34–.4s). No bounce, no color inversion.
- CTAs hover-tint sage `rgba(211,218,167,.42)`.
- Search focus: `style-focus-within` → brand border + `--focus-ring` glow.

**Icons**
- Custom inline SVG set, 19px, stroke 1.6, round caps/joins, ROUNDED geometry (soft corners, rx 2.3–3.4). Dashboard = 4 rounded squares grid; Projects = soft folder; Inspiration = rounded image; Notes = soft doc; Resources = rounded bookmark. Generic/sharp Heroicons look is rejected. Reference: modern macOS / Arc / rounded-startup icon style.

## 3. Dashboard Structure (`Dashboard.dc.html`)

Root: full-viewport flex (`height:100vh`), photographic meadow background (`uploads/image.png_2K_202607161048%201.png`, full-res, cover, no overlays, no compression) + `background-color:var(--surface-page)`.
**Background behavior rule:** the photo shows ONLY on the Latest (home) tab; every other tab renders `background-image:none` → warm beige page (`heroBgImage: showLatest ? bgMap[bgKey] : 'none'` in logic).

Content column: `max-width:1360px`, padding `0 clamp(32px,5vw,72px) 96px`, centered; scrolls inside `<main>`.

- **Hero (centered, editorial):** date eyebrow → Canela greeting with italic name → subtitle → search → 3 quick actions. Date: 11px, 500, `.28em` tracking, uppercase, forest green `#2F4635`, flanked by 22px hairlines. Search: 560px max glass field, 16px radius, leading search icon, trailing ⌘K chip (8px radius, `rgba(36,38,33,.06)` fill). Quick actions: "New project / New inspiration / New note" — EQUAL visual weight (no primary CTA; DS Button components were replaced with custom glass buttons for this), 40px tall, 12px radius, sage-green text `#2F4635` + sage plus icon, glass fill `.34` white.
- **Tab row:** segmented control (macOS/Linear feel): container `rgba(255,255,255,.42)` blur, 13px radius, 4px padding; buttons 9px radius, `8px 16px`, 12.5px text; active = near-opaque white `rgba(255,255,255,.92)` + small shadow, weight 500 vs 400. Tabs: **Latest / Projects / Inspiration / Notes / Resources**. Right side: "Recently updated" glass sort control (13px radius).
- **Latest tab:** exactly FOUR fixed cards (latest Project, Note, Inspiration, Resource), one horizontal row, `grid-template-columns:repeat(4,minmax(0,1fr))`, `min-width:960px` inside an `overflow-x:auto` wrapper (never wraps, never crushes). All 320px tall, `overflow:hidden`.
- **Module tabs:** 3-column CSS masonry (`column-count`, tweakable 2–4) of richer cards filtered by category (`visibleFeed`).

Tweakable props (`data-props`): `backgroundStyle` (meadow/wash/none), `feedColumns` (2–4), `sidebarStartCollapsed`.

## 4. Sidebar

- Glass panel 264px / 78px collapsed; width animates `.34s var(--ease-breath)`; wrapped in `position:relative` container (z-index 3).
- **Collapse button:** 24px frosted-white circle (`rgba(255,255,255,.78)` + blur, white border, dark 1.8-stroke chevron) straddling the right border (`right:-12px; top:32px`) — half in, half out. Chevron rotates 180° when collapsed. History: started inside the header (rejected), then dark ink circle (rejected as too heavy) → current frosted version. Must stay discoverable but visually quiet.
- **Header:** Morrow quatrefoil icon (`assets/morrow-icon-black.svg`) + "Morrow" wordmark in Canela 21px (label hidden when collapsed via `sc-if showLabels`).
- **Nav:** Dashboard (active: near-white pill `rgba(255,255,255,.8)`, soft shadow, sage icon, dark 500 label), others: tertiary text, hover `rgba(255,255,255,.45)` + darken. Labels 13.5px/500/`line-height:1`. Notes row has a count badge "12" (`rgba(36,38,33,.06)` chip). Icons per §2.
- **Pinned section:** "PINNED" eyebrow + compact Project-card-family preview: 9px-padded glass card → metadata top (PROJECT eyebrow + "2d ago", title 12.5px) → 10px-radius cover image below (86px, 44px when collapsed) with mini glass progress pill (65%) overlaid. When collapsed only the image square shows.
- **Footer (pinned to bottom, nav scrolls):** 38px rounded-square (12px) sage-gradient initials tile "JL" (replaced the DS oval Avatar — user hated the oval), name "Jordan Lee" + "Product designer", 3-dot overflow button. Separated by `--border-subtle` hairline.
- Structure note: nav + pinned live in a `flex:1; overflow-y:auto` region so the profile never clips at short viewports (was a verifier fix).

## 5. Card System

All cards share: 20px radius, glass fill, delicate white border, inset top highlight, soft layered shadow, hover lift −3px + deeper shadow, `cursor:pointer`. Content types must be recognizable within one second WITHOUT reading the title.

**Latest (dashboard preview) cards — 320px tall, equal weight, internally distinct:**
1. **Project** (strongest card; composition follows the "Discovering peace" reference): eyebrow row (PROJECT sage / "2d ago") → title 16px/500 → one-line ellipsized desc → rounded 14px cover image fills remaining height, carrying two glass pills: "● In progress" status (top-left) and progress-bar + "65%" (bottom strip). Structured, professional, hierarchy over density (milestones list was cut in the final pass).
2. **Note:** paper-warm gradient fill `linear-gradient(168deg, rgba(255,252,243,.78), rgba(255,255,255,.5))`; NOTE eyebrow + "Today"; title "Today's focus" in **Canela italic 24px**; dashed hairline; 4-item checklist (17px 5px-radius sage checkboxes, done = strikethrough tertiary); footer "2 of 4 done". Feels like a real note object, editorial.
3. **Inspiration:** gallery-stack composition — 12px padding; cover (`assets/lotus-petals-1.png`, 14px radius) layered over two slightly-rotated white backing cards (3.5° / −2°) so corners peek like a stack of shots (per the stacked-card reference); below: INSPIRATION eyebrow (blush #BF6968) + "24 items", title, "Updated yesterday". Visual-first.
4. **Resource:** RESOURCE eyebrow + "Saved 3d ago"; mini browser-chrome preview (22px bar with 3 dots + dark #0D1117 GitHub body, `flex-shrink:0` — clipping was a verifier fix); favicon tile + "github.com"; title "copilot-for-xcode"; ellipsized desc; footer: Swift language dot + ★ 5.5k. Arc/Readwise saved-reference feeling, compact.

**Masonry (module page) cards:**
- **Project** — SAME family as the preview card (synchronized per user demand): status pill + 3-dot menu top → title/desc → rounded 14px cover with glass progress pill → tag chips (8px radius) + updated. Metadata-top / image-bottom, never edge-to-edge image on top.
- **Inspiration collection** — 14px padding, large 4:3 cover (16px radius) with dark glass tag chip, 3 square thumbs row, title + count.
- **Notes** (each type instantly recognizable): checklist card (uppercase icon eyebrow + items), quote card (sage-gradient fill, giant Canela quote mark, Canela italic 23px quote, attribution), text/meeting note (doc icon eyebrow, title, body), image note (4:5 photo + caption).
- **Resources**: GitHub repo card (dark icon tile, owner/repo, desc, language dot + stars + updated), YouTube card (16:9 thumb, blurred dark play circle, duration chip, coral VIDEO eyebrow), Figma file card (cream preview tile with Figma logo, editors + domain).

**Relationship rule:** dashboard preview cards are condensed siblings of full-page cards — same materials, same internal identity, less information.

## 6. Chronological Decision Log

1. Hi-fi built as separate `Dashboard.dc.html`; wireframes preserved untouched.
2. First pass: meadow as soft "sky wash" behind hero only, fading to cream (later superseded).
3. `color-mix(...with transparent)` gradients failed → explicit rgba stops (technical note).
4. "All" tab → renamed **Latest**, showing exactly 4 module cards, nothing more (user correction).
5. Rounded capsule/pill tabs REJECTED → segmented rounded-rectangle control (Linear/Raycast).
6. Background v2: full-dashboard photographic background, glass surfaces floating above; image stays recognizable; blur only inside panels.
7. Quick actions: primary/secondary/ghost hierarchy REJECTED → three equal outlined-glass buttons; later black emphasis also rejected → sage-toned.
8. Hero italic moved from "morning" to the user's name "Jordan".
9. Satoshi → **Helvetica Neue Cyr** for all UI text (user-supplied fonts); Canela stays display-only.
10. Full-res background swap (user re-uploaded; never compress).
11. Collapse button: inside header → edge-straddling dark circle → **frosted white circle** (too-heavy feedback).
12. Icons: generic outline set → custom rounded thin-stroke set (reference-driven).
13. Oval DS Avatar → rounded-rect initials tile.
14. One radius family enforced; card heights 372 → 320px; card padding tightened.
15. Project card redesigned metadata-top/image-bottom (reference composition), synchronized across dashboard, masonry, and sidebar pinned versions; milestone rows cut for hierarchy.
16. Global text-contrast overrides; control type sizes reduced one step.
17. Photo background restricted to Latest tab; module tabs get beige page background.
18. Verifier fixes: sidebar footer overflow (scrollable nav region), resource preview clipping (`flex-shrink:0` + ellipsis), Latest-grid crush at narrow widths (960px floor + overflow-x auto + `overflow:hidden` shells).
19. User direct-edits (respect, do not revert): hero subtitle `max-width:600px`, header width/padding tweaks, a gap→14px, a border-radius→10px, Latest-grid min-width unset on one div, height tweak.

## 7. Current State

Complete and verified (no console errors): glass sidebar with collapse, custom icon set, pinned project mini-card, profile footer; editorial hero (date eyebrow, Canela greeting with italic name, glass search with ⌘K, 3 sage CTAs); segmented tabs + sort; Latest tab with 4 bespoke 320px cards on one row; masonry module feeds with 9 distinct card types; Helvetica Neue Cyr typography; full-res meadow on Latest only; contrast-corrected text; tweakable props (background style, feed columns, collapsed start). All content is static demo data in `renderVals()`.

## 8. Remaining Improvements

**High:** apply user's latest direct-edit intents consistently (they touched hero widths/paddings manually — audit surrounding rhythm); responsive audit below ~1100px (masonry columns, hero scale); real hover/press states audit against DS motion tokens (press = shade darker, currently only hover).
**Medium:** dropdown menus (sort control and card 3-dot menus are non-functional); empty states ("Nothing pinned yet" tone); tab-switch transition (gentle fade, `--dur-med`); dark-text-on-image contrast check for other cover images.
**Low:** collapsed-sidebar tooltips; keyboard focus states beyond search; ⌘K command palette; grain texture on beige module background; Projects/Inspiration/Notes/Resources full pages themselves (only the dashboard exists in hi-fi).

## 9. Design Principles

Calm > loud. Editorial > dashboard-y. Contrast as hierarchy, color from imagery. One geometry family, one glass material, one icon voice. Typography does the emotional work (Canela italic accents); everything else stays quiet. References: attached sidebar reference (Skylar Rowe writer workspace), stacked-shots collection reference, "Discovering peace" journal-card reference, ShotScope glass sidebar, Linear/Arc/Craft/Notion Calendar/Apple. Unique quality: a photographic landscape home that feels like a place, with UI floating as morning-light glass above it.

## 10. Art Direction (for the next designer)

You're finishing a premium macOS-grade creative workspace. The mood is early morning: warm haze, sage and blush dusted hues, diffused light shadows. Nothing snaps, nothing shouts. Hierarchy is built from contrast steps and size, not color; the single Canela-italic word per screen is the emotional signature. Every control is optically centered, slightly smaller than instinct suggests, and made of the same frosted glass. Density is the enemy — when in doubt, remove a metadata row rather than shrink type. Quality bar: "could ship on Behance as a real product" — check optical alignment, border opacities (.5–.65 white), shadow softness, and baseline rhythm before adding anything new.

## 11. Rules That Should Never Be Broken

1. Never redesign the approved UX — structure, flows, and module set are locked.
2. Latest tab = exactly 4 cards (Project, Note, Inspiration, Resource), one row, equal heights.
3. No pill-shaped controls; the rounded-rectangle radius family is law (cards 20 / images 14 / buttons 12–14 / tabs 13-9 / chips 8).
4. No dark borders on glass; borders are 1px translucent white; shadows warm and near-invisible; inner top highlight on glass.
5. Background photo: full-res, never blurred/compressed/overlaid; Latest tab only; module tabs = warm beige.
6. Canela = display + italic accents only (Thin/Light exist); Helvetica Neue Cyr = all UI text; no third typeface; UI weights 400/500 (700 only in eyebrows).
7. Exactly one italic accent moment in the hero — the user's name.
8. Quick actions have equal visual weight — no primary CTA on the dashboard.
9. Each content type must be recognizable in <1s without reading; preview and full cards stay one family.
10. Icons: rounded geometry, 1.6 stroke, round caps — never sharp or mixed-weight.
11. Contrast is hierarchy: no washed-out gray text on glass (tertiary ≥ #6E695F on these surfaces).
12. Motion: slow, breathing eases; hover = subtle fill + 1px lift; never bounce.
13. No emoji; sentence case everywhere except letter-spaced eyebrows.
14. Respect the user's direct visual-editor edits — never silently revert them.
15. Follow the Morrow DS tokens (`var(--*)`) — don't invent colors or spacing outside the palette.

# Morrow Design System

Morrow is a mindful digital workspace for UI/UX designers — a calm, editorial daily dashboard that replaces scattered tools (Figma links, mood-board screenshots, sticky notes, bookmark folders) with one organized home for projects, inspiration, notes, and resources.

**Sources provided for this design system** (stored under `uploads/`, kept here for reference in case of future access):
- Brand brief (personality, visual language, color/typography direction, UI principles, motion, project goals) — pasted text, no external link.
- Logo exports: `Logo color horizontal/main.svg`, `Logo icon color.svg` — still corrupted (Figma export missing embedded raster data inside a `<pattern>/<image>` fill) and fail to decode. `Logo black/white main/horizontal.svg` and `Logo icon black/white.svg` are clean, valid vectors and are now the system's official logo (see `assets/logo/`) — a quatrefoil mark of four overlapping circles plus a Canela-esque custom wordmark.
- Color palette reference: `color pallete.png`.
- Glass botanical object renders: `3D flower.png`, `image 3/4/6/7.png` (flower, blob, leaf, tulip forms in sage/blush glass).
- Moodboard/reference screens (competitor & inspiration UIs, not Morrow's own product): `image 5/84/85/87/88/89/145.png`.
- Generated atmosphere imagery: `image.png_2K_*.png` — meadow hero, grain gradients, lotus/petal macro photography.
- Type: Canela Trial (Thin, Light + italics) and Satoshi (Light–Bold + italics), `.otf` files.

No codebase or Figma file was attached, so this system was built from the brand brief + reference imagery rather than an existing product. Components are an original, from-scratch set sized to Morrow's four modules (Dashboard, Projects, Inspiration, Notes, Resources).

## Index
- `styles.css` — root stylesheet, import this one file.
- `tokens/` — colors, fonts, typography scale, spacing/radius/shadow/motion.
- `assets/fonts/` — Canela + Satoshi `.otf` files.
- `assets/images/` — glass botanical renders, atmosphere gradients, macro petal photography, palette reference.
- `components/` — reusable UI primitives (see Components below).
- `ui_kits/dashboard/` — full click-through recreation of the Morrow app (Dashboard, Projects, Inspiration, Notes, Resources).
- `guidelines/` — foundation specimen cards for the Design System tab.
- `SKILL.md` — portable skill file for using this system elsewhere (e.g. Claude Code).

## Components
Grouped by concern; each has a matching `@dsCard` in the Design System tab.
- **Core** — `Button`
- **Forms** — `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`
- **Feedback** — `Badge`, `Tag`, `Tooltip`, `Toast`, `Dialog`
- **Navigation** — `Tabs`
- **Data** — `Card`, `Avatar`, `CollectionCard`, `JournalCard`

### Intentional additions
No source defined a component inventory (brand-brief-only run), so this is a standard set sized to the brief's four modules — nothing beyond what Projects/Inspiration/Notes/Resources screens need.

## CONTENT FUNDAMENTALS
**Voice:** calm, first-person-singular ("My Projects", "My Notes") — the app speaks as *your* personal space, not a SaaS product addressing "you" as a customer. Sentences are short, declarative, unhurried. No hype, no urgency language ("Hurry!", "Don't miss out"), no exclamation points.

**Tone examples in the spirit of the brand:**
- "Today's focus" (not "Your daily to-do list!!")
- "Discovering peace" / "Far from the city's noise, the green mountains stretch endlessly into the horizon, blanketed with mist and silence." — editorial, sensory, unhurried captions rather than feature-speak.
- Empty states read like gentle invitations: "Nothing pinned yet" rather than "No data found."

**Casing:** sentence case throughout — headings, buttons, nav labels. Never ALL CAPS except tiny eyebrow labels (category tags), which use letter-spacing instead of size to stand out.

**Emoji:** never used. Icons only, and only when they clarify rather than decorate.

**Numbers/data:** shown quietly (a count badge, a small stat) — never a dashboard of vanity metrics. If a number doesn't help the designer act, it's cut.

## VISUAL FOUNDATIONS
**Color:** early-morning-light palette — muted sage greens (`#6B8C6D`, `#748C5A`, soft `#D3DAA7`, `#B4C09C`) as primary/brand, dusty blush pinks (`#D8A5A1`, `#EFC7CF`, `#DAB0BC`) as secondary, a single muted coral (`#BF6968`) reserved for standout accents/CTAs, warm creams (`#EEEAE6`, `#F2F2F2`) as page/card surfaces, warm gray (`#CAC9C7`) for borders, and deep forest (`#2F4635`) for ink/dark surfaces. Nothing is saturated — every hue is dusted, as if lit through morning haze.

**Type:** Canela (Thin/Light + italics) for all display and section headers — editorial, serif, a little emotional, often set large and airy; Satoshi (Light–Bold) for all UI, body copy, labels — clean, neutral, highly legible. The pairing itself carries the brand's "editorial elegance meets clean simplicity" personality; never substitute a grotesque for Canela's role or vice versa.

**Spacing:** generous throughout — base unit 4px, but real layouts breathe at 24–96px between sections. Content never touches edges; cards carry 20–28px internal padding minimum.

**Backgrounds:** flat warm cream/canvas as the default; full-bleed photography (meadow, macro petals) only in hero/moment moments, never behind dense UI. Soft grain-gradient washes (blush→sage→cream) used as atmospheric section dividers or card backgrounds — never a hard, flat digital gradient. No repeating patterns, no illustration style beyond the glass botanical objects.

**Glass botanical objects:** the brand's one recurring illustrative motif — soft, rounded, translucent, slightly inflated flower/leaf/petal forms with internal gradient + delicate specular highlight, always in the sage/blush family. Use sparingly as a hero accent, never as a repeating icon set.

**Animation:** slow and meditative — fades and gentle rises (`--dur-med` 360ms, `--dur-slow` 720ms, custom "breathing" ease `--ease-breath`), never a spring/bounce curve. Hover = soft opacity dip + 1px lift, not color inversion. Press = no shrink, just a shade darker.

**Hover / press states:** hover lightens fills slightly and lifts 1px with a slow ease; press deepens the fill fractionally. No hard color swaps, no shadows popping in in a snap.

**Borders & shadows:** borders are rare and always 1px, low-contrast (`--border-subtle`/`--border-default`) — most separation comes from soft elevation instead. Shadow system is a soft multi-layer stack (`--shadow-sm/md/lg`) using a warm, low-opacity shadow tint (never pure black) — think diffused light, not hard drop shadow. No inner glow "capsule" gradients.

**Corner radii:** large and consistent — 10px small controls, 16px inputs, 24px cards, 32px hero surfaces, full pill for buttons/tags/switches. Never a sharp 0–4px corner.

**Transparency & blur:** used deliberately for the "diffused glass" motif — frosted scrim behind dialogs (`backdrop-filter: blur`), soft translucent overlays on hero imagery captions. Not used on ordinary cards/buttons.

**Imagery color vibe:** warm, soft-focus, sunlit — meadow greens and blush pinks, gentle grain, shallow depth of field, never harsh contrast or cool/blue tones. Macro botanical detail and quiet landscapes only; no studio product shots, no stock-photo people looking at laptops.

**Layout:** editorial grid — generous whitespace, sidebar + content pattern for the app shell, cards in loose grids rather than dense tables.

## ICONOGRAPHY
No icon font or SVG icon set was provided. **Logo:** black and white marks are now available and live in `assets/logo/` — `morrow-logo-black.svg` / `morrow-logo-white.svg` (stacked mark + wordmark), `morrow-logo-horizontal-black/white.svg` (lockup), and `morrow-icon-black/white.svg` (the quatrefoil icon alone, four overlapping circles forming a soft flower). The **color** logo exports (`Logo color *.svg`) are still corrupted Figma exports — the mark is filled via a `<pattern>`/`<image>` whose image data never made it into the file, so only the black/white versions are usable. Please re-export a color version (flatten to plain vector paths, or export as PNG) if you want one.

For UI icons, this system uses simple inline SVG line icons (1.5px stroke, rounded joins) sized 20px, matching the brand's soft-but-precise character — see any component using an `icon` prop. No emoji, no unicode glyphs as icons. If a production build needs more icon coverage than the handful drawn here, **Lucide** (CDN) is the recommended match: same stroke weight and rounded-cap style.

## Fonts — action needed
Canela Trial is a licensed trial: only **Thin** and **Light** weights (+ italics) were provided, no Regular/Medium/Bold. All display type in this system is built from those two weights only. If your production Canela license includes more weights, add the matching `@font-face` rules to `tokens/fonts.css`.

import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * Tailwind resolves through the CSS custom properties defined in
 * src/design-system/tokens/*.css rather than duplicating literal values —
 * this preserves the override cascade documented in docs/DESIGN.md.
 * Composite glass effects (blur+saturate+border+inset-highlight) are NOT
 * modeled here — see src/design-system/tokens/glass.css for those classes.
 */
export default {
  darkMode: undefined, // single fixed theme — no dark/light toggle in scope
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    screens: {
      board: "1181px",
    },
    extend: {
      colors: {
        // `rgb(var(--token) / <alpha-value>)` lets Tailwind opacity modifiers
        // (e.g. bg-surface-card/60) work against the channel-triplet tokens.
        sage: {
          100: "rgb(var(--color-sage-100) / <alpha-value>)",
          200: "rgb(var(--color-sage-200) / <alpha-value>)",
          300: "rgb(var(--color-sage-300) / <alpha-value>)",
          400: "rgb(var(--color-sage-400) / <alpha-value>)",
          500: "rgb(var(--color-sage-500) / <alpha-value>)",
          600: "rgb(var(--color-sage-600) / <alpha-value>)",
          700: "rgb(var(--color-sage-700) / <alpha-value>)",
          900: "rgb(var(--color-sage-900) / <alpha-value>)",
        },
        blush: {
          100: "rgb(var(--color-blush-100) / <alpha-value>)",
          200: "rgb(var(--color-blush-200) / <alpha-value>)",
          300: "rgb(var(--color-blush-300) / <alpha-value>)",
          400: "rgb(var(--color-blush-400) / <alpha-value>)",
          600: "rgb(var(--color-blush-600) / <alpha-value>)",
        },
        cream: {
          50: "rgb(var(--color-cream-50) / <alpha-value>)",
          100: "rgb(var(--color-cream-100) / <alpha-value>)",
          200: "rgb(var(--color-cream-200) / <alpha-value>)",
        },
        warm: {
          300: "rgb(var(--color-warm-300) / <alpha-value>)",
          500: "rgb(var(--color-warm-500) / <alpha-value>)",
        },
        ink: {
          700: "rgb(var(--color-ink-700) / <alpha-value>)",
          900: "rgb(var(--color-ink-900) / <alpha-value>)",
        },
        surface: {
          page: "rgb(var(--color-surface-page) / <alpha-value>)",
          card: "rgb(var(--color-surface-card) / <alpha-value>)",
          dark: "rgb(var(--color-surface-dark) / <alpha-value>)",
          muted: "rgb(var(--color-surface-muted) / <alpha-value>)",
        },
        text: {
          primary: "rgb(var(--color-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
          tertiary: "rgb(var(--color-text-tertiary) / <alpha-value>)",
        },
        border: {
          // Fixed-alpha full color — no <alpha-value> placeholder.
          subtle: "var(--border-subtle)",
          default: "rgb(var(--color-border-default) / <alpha-value>)",
        },
        brand: {
          primary: "rgb(var(--color-brand-primary) / <alpha-value>)",
          "primary-hover": "rgb(var(--color-brand-primary-hover) / <alpha-value>)",
        },
        accent: {
          coral: "rgb(var(--color-accent-coral) / <alpha-value>)",
        },
        ring: "var(--focus-ring)",
      },
      borderRadius: {
        card: "var(--radius-card)",
        "card-image": "var(--radius-card-image)",
        "card-image-sidebar": "var(--radius-card-image-sidebar)",
        search: "var(--radius-search)",
        button: "var(--radius-button)",
        "tab-container": "var(--radius-tab-container)",
        "tab-button": "var(--radius-tab-button)",
        chip: "var(--radius-chip)",
        "nav-item": "var(--radius-nav-item)",
        avatar: "var(--radius-avatar)",
      },
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        8: "var(--space-8)",
        10: "var(--space-10)",
        12: "var(--space-12)",
        16: "var(--space-16)",
        20: "var(--space-20)",
        24: "var(--space-24)",
        32: "var(--space-32)",
      },
      fontFamily: {
        // Each CSS var already resolves to a full comma-separated font stack.
        body: ["var(--font-body)"],
        display: ["var(--font-display)"],
      },
      boxShadow: {
        resting: "var(--shadow-resting)",
        hover: "var(--shadow-hover)",
      },
      transitionTimingFunction: {
        breath: "var(--ease-breath)",
        out: "var(--ease-out)",
      },
      transitionDuration: {
        fast: "var(--duration-fast)",
        medium: "var(--duration-medium)",
        slow: "var(--duration-slow)",
      },
    },
  },
  plugins: [animate],
} satisfies Config;

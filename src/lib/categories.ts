/**
 * Shared, workspace-wide category vocabulary. Originally Resources-specific
 * (matched against `resource.tags`); Projects' sidebar Category field and
 * Inspiration boards' quick-create form reuse the same list so the vocabulary
 * never drifts between features.
 */
export const CATEGORY_OPTIONS = [
  "UX Research",
  "AI",
  "Accessibility",
  "Motion",
  "Development",
  "Branding",
  "Fintech",
  "Typography",
] as const;

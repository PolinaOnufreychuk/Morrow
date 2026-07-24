import { forwardRef, type ReactNode, type SVGProps } from "react";

/**
 * Minimal hand-rolled icon set — NOT a finalized icon library.
 * Only the icons actually needed by shipped screens exist here.
 * Spec (docs brief): 19px viewport, stroke width 1.6, rounded line caps,
 * corner radius 2.3–3.4 where rectangles are used.
 */
export type IconName =
  | "search"
  | "close"
  | "chevron-down"
  | "chevron-right"
  | "plus"
  | "overflow-dots"
  | "arrow-left"
  | "alert"
  | "sliders"
  | "check"
  | "folder"
  | "image"
  | "bookmark"
  | "file-text"
  | "restore"
  | "link"
  | "external-link"
  | "upload"
  | "calendar";

const paths: Record<IconName, ReactNode> = {
  search: (
    <>
      <circle cx="8.5" cy="8.5" r="6" />
      <path d="M13.2 13.2 17 17" />
    </>
  ),
  close: (
    <>
      <path d="M5 5l9 9" />
      <path d="M14 5l-9 9" />
    </>
  ),
  "chevron-down": <path d="M5 7.5 9.5 12 14 7.5" />,
  "chevron-right": <path d="M7.5 5 12 9.5 7.5 14" />,
  plus: (
    <>
      <path d="M9.5 4v11" />
      <path d="M4 9.5h11" />
    </>
  ),
  "overflow-dots": (
    <>
      <circle cx="4.5" cy="9.5" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="9.5" cy="9.5" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="9.5" r="1.15" fill="currentColor" stroke="none" />
    </>
  ),
  "arrow-left": (
    <>
      <path d="M15 9.5H4" />
      <path d="M9 4.5 4 9.5 9 14.5" />
    </>
  ),
  alert: (
    <>
      <path d="M9.5 3.5 17 16.5H2z" strokeLinejoin="round" />
      <path d="M9.5 8v3.5" />
      <circle cx="9.5" cy="14" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  sliders: (
    <>
      <path d="M3 6h16" />
      <circle cx="11" cy="6" r="2.1" fill="currentColor" stroke="none" />
      <path d="M3 13h16" />
      <circle cx="7" cy="13" r="2.1" fill="currentColor" stroke="none" />
    </>
  ),
  check: <path d="M3.5 9.5 7.5 13.5 15.5 4.5" />,
  folder: (
    <>
      <path d="M2 4h5l2 2h10c1 0 1.5.5 1.5 1.5v9c0 1-.5 1.5-1.5 1.5H2c-1 0-1.5-.5-1.5-1.5v-11C.5 4.5 1 4 2 4z" />
    </>
  ),
  image: (
    <>
      <rect x="2.5" y="2.5" width="14" height="14" rx="1" />
      <circle cx="6.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      <path d="M2.5 13.5 8 8 16.5 16.5" />
    </>
  ),
  bookmark: (
    <>
      <path d="M4 2v14l5.5-3.5L15 16V2" />
    </>
  ),
  "file-text": (
    <>
      <path d="M4 2v15h11V2z" />
      <path d="M7 6h5M7 9h5M7 12h3" />
    </>
  ),
  restore: (
    <>
      {/* Counter-clockwise "undo" arrow — a hooked arrowhead plus a ~270°
          arc, reading unambiguously as "restore" rather than a partial
          circle with no directional cue. */}
      <path d="M3 4v4.4h4.4" strokeLinejoin="round" />
      <path d="M3.6 12A6.7 6.7 0 1 0 5.7 5.3L3 8.4" />
    </>
  ),
  link: (
    <>
      <path d="M8 11.5a3.6 3.6 0 0 0 5 0l2-2a3.6 3.6 0 0 0-5-5.1l-1 1" strokeLinejoin="round" />
      <path d="M11 7.5a3.6 3.6 0 0 0-5 0l-2 2a3.6 3.6 0 0 0 5 5.1l1-1" strokeLinejoin="round" />
    </>
  ),
  "external-link": (
    <>
      <path d="M8 3.5H3.5V15.5H15.5V11" strokeLinejoin="round" />
      <path d="M9.5 9.5 16 3" />
      <path d="M11.5 3H16v4.5" strokeLinejoin="round" />
    </>
  ),
  upload: (
    <>
      <path d="M9.5 12.5V3" />
      <path d="M5.5 7 9.5 3l4 4" />
      <path d="M3 13v2.5h13V13" />
    </>
  ),
  calendar: (
    <>
      <rect x="2.5" y="4" width="14" height="12.5" rx="2.3" />
      <path d="M2.5 8h14" />
      <path d="M6 2.5v3" />
      <path d="M13 2.5v3" />
    </>
  ),
};

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 19, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 19 19"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  ),
);
Icon.displayName = "Icon";

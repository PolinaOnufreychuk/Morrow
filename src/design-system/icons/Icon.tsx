import { forwardRef, type ReactNode, type SVGProps } from "react";

/**
 * Minimal hand-rolled icon set — NOT a finalized icon library.
 * Only the icons actually needed to render the static Step-5 layouts exist
 * here (search, close, chevron, plus, overflow-dots, arrow-left).
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
  | "alert";

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

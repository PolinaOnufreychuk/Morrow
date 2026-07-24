import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ModalSectionProps {
  /** Visual weight: primary fields get the most breathing room, optional
   * fields the least — hierarchy via spacing/order only, never color. */
  tone?: "primary" | "secondary" | "optional";
  children: ReactNode;
  className?: string;
}

const TONE_GAP: Record<NonNullable<ModalSectionProps["tone"]>, string> = {
  primary: "gap-5",
  secondary: "gap-4",
  optional: "gap-3",
};

/**
 * Groups a modal form's fields into primary/secondary/optional tiers.
 * Sections are meant to be stacked inside a form with the default `gap-6`
 * from ModalShell's body wrapper providing the between-section rhythm.
 */
export function ModalSection({ tone = "primary", children, className }: ModalSectionProps) {
  return <div className={cn("flex flex-col", TONE_GAP[tone], className)}>{children}</div>;
}

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** "default" is the standard 10px radius every field uses. "soft" is the
   * rounder field from the "New project" mockup — opt in per-form. */
  rounded?: "default" | "soft";
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, rounded = "default", ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[96px] w-full border border-transparent bg-cream-100/60 px-3.5 py-3 text-[14px] font-body text-text-primary placeholder:text-text-tertiary transition-shadow duration-fast ease-out aria-invalid:border-blush-400 aria-invalid:bg-blush-100/40",
        rounded === "soft"
          ? "min-h-[120px] rounded-[16px] bg-[#F9F9F8] px-4 py-3.5 text-[15px] placeholder:text-[#BFBEBC]"
          : "rounded-button",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring focus-visible:border-brand-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

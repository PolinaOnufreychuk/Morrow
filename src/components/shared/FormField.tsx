import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  /** Must match the id the caller puts on the actual control. */
  htmlFor?: string;
  label: string;
  /** Renders a quiet "Optional" suffix next to the label — presentation only,
   * callers must independently confirm the field is actually optional in its
   * zod schema. Does not affect validation. */
  optional?: boolean;
  /** Shown under the control when there's no error. */
  helperText?: string;
  /** Shown under the control instead of helperText, styled as an error.
   * Callers are responsible for wiring `aria-describedby`/`aria-invalid` on
   * the control itself — see this component's module doc. */
  error?: string;
  /** Right-aligned char counter next to the label, e.g. { current: 120, max: 2000 }. */
  counter?: { current: number; max: number };
  /** "subtle" (default) is the small tertiary-gray label every form uses.
   * "prominent" is the larger, darker label from the "New project" mockup —
   * opt in per-form, don't flip the default. */
  labelTone?: "subtle" | "prominent";
  children: ReactNode;
  className?: string;
}

/**
 * Layout-only label + helper/error slot — standardizes the
 * `<label className="eyebrow">` + spacing + error-paragraph pattern every
 * form previously hand-rolled. Never clones props onto `children`: forms
 * using react-hook-form's `{...register()}` spread must keep full control of
 * their own `id`/`aria-describedby`/`aria-invalid` wiring on the control.
 */
export function FormField({
  htmlFor,
  label,
  optional,
  helperText,
  error,
  counter,
  labelTone = "subtle",
  children,
  className,
}: FormFieldProps) {
  const counterOverMax = counter ? counter.current > counter.max : false;

  return (
    <div className={cn("flex flex-col", labelTone === "prominent" ? "gap-1.5" : "gap-2", className)}>
      {label && (
        <div className="flex items-baseline justify-between gap-2">
          <label
            htmlFor={htmlFor}
            className={cn(
              "normal-case tracking-normal",
              labelTone === "prominent"
                ? "text-[15px] font-normal text-[#525150]"
                : "text-[12.5px] font-medium text-text-tertiary",
            )}
          >
            {label}
            {optional && (
              <span className="ml-1.5 text-[10.5px] font-normal normal-case tracking-normal text-text-tertiary/70">
                Optional
              </span>
            )}
          </label>
          {counter && (
            <span
              className={cn(
                "text-[11px] tabular-nums text-text-tertiary",
                counterOverMax && "text-blush-600",
              )}
            >
              {counter.current}/{counter.max}
            </span>
          )}
        </div>
      )}
      {children}
      {(error || helperText) && (
        <p className={cn("text-[12px]", error ? "text-blush-600" : "text-text-tertiary")}>
          {error ?? helperText}
        </p>
      )}
    </div>
  );
}

import { type ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface PropertyOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
  /** Tint classes (e.g. "bg-sage-100 text-sage-700") for the selected chip —
   * only read when the dropdown's `variant="badge"`. */
  tone?: string;
}

export interface PropertyDropdownProps<T extends string> {
  label?: string;
  /** Renders a quiet "Optional" suffix next to the label — presentation only. */
  optional?: boolean;
  /** "subtle" (default) is the small tertiary-gray label every dropdown
   * uses. "prominent" is the larger, darker label from the "New project"
   * mockup — opt in per-form, don't flip the default. */
  labelTone?: "subtle" | "prominent";
  /** "default" is the standard 10px field radius. "soft" is the rounder
   * field from the "New project" mockup — opt in per-form. */
  rounded?: "default" | "soft";
  /** "plain" (default) shows the selected value as text. "badge" renders it
   * as a tinted chip with its icon — used for Status in the "New project"
   * mockup only; every other consumer (edit mode, sidebar) stays plain. */
  variant?: "plain" | "badge";
  options: PropertyOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  placeholder?: string;
  className?: string;
  /** Overrides the trigger's own classes (e.g. height) independent of the wrapper `className`. */
  triggerClassName?: string;
}

/**
 * Linear-inspired inline editable property control (used for status, etc.
 * on Project Details). A labeled, compact select built on the re-skinned
 * select primitive.
 */
export function PropertyDropdown<T extends string>({
  label,
  optional,
  labelTone = "subtle",
  rounded = "default",
  variant = "plain",
  options,
  value,
  onValueChange,
  placeholder,
  className,
  triggerClassName,
}: PropertyDropdownProps<T>) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className={cn("flex flex-col", labelTone === "prominent" ? "gap-1.5" : "gap-2", className)}>
      {label && (
        <span
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
        </span>
      )}
      <Select value={value} onValueChange={(v) => onValueChange(v as T)}>
        <SelectTrigger
          className={cn(
            rounded === "soft" && "h-[52px] rounded-[16px] bg-[#F9F9F8] p-1 pr-2 text-[15px] font-medium",
            triggerClassName,
          )}
          // Second raised layer: the value sits in a white box inside the thin
          // #F9F9F8 frame (v2 mockup). Chevron stays on the frame at the right.
          // The badge case uses uniform padding so the pill's insets match all round.
          innerClassName={
            rounded === "soft"
              ? variant === "badge"
                ? "flex h-full items-center rounded-[10px] bg-white p-1"
                : "flex h-full items-center rounded-[10px] bg-white px-3"
              : undefined
          }
          iconClassName={rounded === "soft" ? "-translate-y-px" : undefined}
        >
          {variant === "badge" && selectedOption ? (
            <span
              className={cn(
                "inline-flex h-full items-center gap-2 rounded-[7px] px-3.5 text-[14px] font-medium",
                selectedOption.tone,
              )}
            >
              {selectedOption.icon}
              {selectedOption.label}
            </span>
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <span className="flex items-center gap-2">
                {/* The badge icon is white for the gradient trigger chip — it
                    would be invisible on the light list, so skip it here. */}
                {variant !== "badge" && option.icon}
                {option.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

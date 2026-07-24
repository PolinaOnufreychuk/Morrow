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
}

export interface PropertyDropdownProps<T extends string> {
  label?: string;
  /** Renders a quiet "Optional" suffix next to the label — presentation only. */
  optional?: boolean;
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
  options,
  value,
  onValueChange,
  placeholder,
  className,
  triggerClassName,
}: PropertyDropdownProps<T>) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <span className="text-[12.5px] font-medium normal-case tracking-normal text-text-tertiary">
          {label}
          {optional && (
            <span className="ml-1.5 text-[10.5px] font-normal normal-case tracking-normal text-text-tertiary/70">
              Optional
            </span>
          )}
        </span>
      )}
      <Select value={value} onValueChange={(v) => onValueChange(v as T)}>
        <SelectTrigger className={triggerClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <span className="flex items-center gap-2">
                {option.icon}
                {option.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

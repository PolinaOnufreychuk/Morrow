import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/FormField";
import { Icon } from "@/design-system/icons/Icon";
import type { ISODateString } from "@/types/entities";

export interface ProjectDeadlineFieldProps {
  value: ISODateString | null;
  onChange: (value: ISODateString | null) => void;
  id?: string;
  label?: string;
}

/**
 * Plain date input — manual deadline, date only, NO calendar UI
 * (docs/FEATURES.md, docs/DESIGN.md). The calendar glyph in the corner is
 * decorative only: the native browser date-picker button is suppressed
 * (`[&::-webkit-calendar-picker-indicator]`) so typing is the only way in.
 */
export function ProjectDeadlineField({
  value,
  onChange,
  id = "deadline",
  label = "Deadline",
}: ProjectDeadlineFieldProps) {
  return (
    <FormField htmlFor={id} label={label} optional>
      <div className="relative">
        <Input
          id={id}
          type="date"
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value || null)}
          className="pr-10 [&::-webkit-calendar-picker-indicator]:pointer-events-none [&::-webkit-calendar-picker-indicator]:opacity-0"
        />
        <Icon
          name="calendar"
          size={16}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-tertiary"
        />
      </div>
    </FormField>
  );
}

import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/FormField";
import type { ISODateString } from "@/types/entities";

export interface ProjectDeadlineFieldProps {
  value: ISODateString | null;
  onChange: (value: ISODateString | null) => void;
  id?: string;
  label?: string;
}

/**
 * Plain date input — manual deadline, date only, NO calendar UI
 * (docs/FEATURES.md, docs/DESIGN.md).
 */
export function ProjectDeadlineField({
  value,
  onChange,
  id = "deadline",
  label = "Deadline",
}: ProjectDeadlineFieldProps) {
  return (
    <FormField htmlFor={id} label={label} optional>
      <Input
        id={id}
        type="date"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || null)}
      />
    </FormField>
  );
}

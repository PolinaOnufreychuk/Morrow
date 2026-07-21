import { Input } from "@/components/ui/input";
import type { ISODateString } from "@/types/entities";

export interface ProjectDeadlineFieldProps {
  value: ISODateString | null;
  onChange: (value: ISODateString | null) => void;
  id?: string;
}

/**
 * Plain date input — manual deadline, date only, NO calendar UI
 * (docs/FEATURES.md, docs/DESIGN.md).
 */
export function ProjectDeadlineField({ value, onChange, id = "deadline" }: ProjectDeadlineFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="eyebrow text-text-tertiary">
        Deadline
      </label>
      <Input
        id={id}
        type="date"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || null)}
      />
    </div>
  );
}

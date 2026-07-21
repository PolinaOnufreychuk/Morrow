import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SortOption<T extends string> {
  value: T;
  label: string;
}

export interface SortSelectProps<T extends string> {
  options: SortOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  placeholder?: string;
  className?: string;
}

/** Reusable sort dropdown built on the re-skinned select primitive. */
export function SortSelect<T extends string>({
  options,
  value,
  onValueChange,
  placeholder = "Sort by",
  className,
}: SortSelectProps<T>) {
  return (
    <Select value={value} onValueChange={(v) => onValueChange(v as T)}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

import { SegmentedTabs } from "@/components/shared/SegmentedTabs";
import type { ProjectStatusFilter } from "../types";

const OPTIONS: { value: ProjectStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in-progress", label: "In progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Completed" },
];

export interface ProjectStatusTabsProps {
  value: ProjectStatusFilter;
  onValueChange: (value: ProjectStatusFilter) => void;
  counts?: Partial<Record<ProjectStatusFilter, number>>;
}

export function ProjectStatusTabs({ value, onValueChange, counts }: ProjectStatusTabsProps) {
  return (
    <SegmentedTabs
      options={OPTIONS.map((option) => ({ ...option, count: counts?.[option.value] }))}
      value={value}
      onValueChange={onValueChange}
      className="h-11 bg-surface-muted"
    />
  );
}

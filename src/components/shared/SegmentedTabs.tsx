import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface SegmentedTabOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

export interface SegmentedTabsProps<T extends string> {
  options: SegmentedTabOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  className?: string;
}

/**
 * Reusable segmented control built on the re-skinned tabs primitive.
 * Used for status filters, view switches, etc. — one component, parametrized.
 */
export function SegmentedTabs<T extends string>({
  options,
  value,
  onValueChange,
  className,
}: SegmentedTabsProps<T>) {
  return (
    <Tabs value={value} onValueChange={(v) => onValueChange(v as T)}>
      <TabsList className={className}>
        {options.map((option) => (
          <TabsTrigger key={option.value} value={option.value}>
            {option.label}
            {option.count !== undefined && (
              <span className="ml-1.5 text-text-tertiary">{option.count}</span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

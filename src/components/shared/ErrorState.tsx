import { Icon } from "@/design-system/icons/Icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Intentional error state — distinct from EmptyState (which means "no data
 * yet") and NoSearchResultsState (which means "data exists, filters don't
 * match"). This means "we tried to load/save and it failed."
 */
export function ErrorState({
  title = "Something went wrong",
  description = "Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-blush-300 bg-blush-100/40 px-6 py-16 text-center",
        className,
      )}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blush-100 text-blush-600">
        <Icon name="alert" size={20} />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-[16px] font-medium text-text-primary">{title}</h3>
        <p className="mx-auto max-w-sm text-[13px] text-text-secondary">{description}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

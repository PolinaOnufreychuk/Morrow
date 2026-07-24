import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/design-system/icons/Icon";
import { cn } from "@/lib/utils";

export type EntityType = "project" | "note" | "resource" | "collection";

export interface EntityOverflowAction {
  label: string;
  onSelect: () => void;
  destructive?: boolean;
}

export interface EntityOverflowMenuProps {
  entityType: EntityType;
  onEdit?: () => void;
  onPin?: () => void;
  onRestore?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  /** Fully custom action list — overrides the type-derived defaults. */
  actions?: EntityOverflowAction[];
  triggerClassName?: string;
}

/**
 * Overflow (three-dot) menu whose items differ per entity type. The default
 * item set is derived from `entityType`; callers can also pass an explicit
 * `actions` array. One component, parametrized — not copy-pasted per screen.
 */
export function EntityOverflowMenu({
  entityType,
  onEdit,
  onPin,
  onRestore,
  onDelete,
  onDuplicate,
  actions,
  triggerClassName,
}: EntityOverflowMenuProps) {
  const items: EntityOverflowAction[] = actions ?? buildDefaultActions(entityType, {
    onEdit,
    onPin,
    onRestore,
    onDelete,
    onDuplicate,
  });

  if (items.length === 0) return null;

  return (
    // Stops clicks on the trigger and (portaled) menu items from bubbling
    // into an ancestor card's onClick — e.g. a pinned sidebar card that
    // opens its detail view on click.
    <div onClick={(event) => event.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-chip text-text-secondary transition-colors duration-fast ease-out hover:bg-cream-100 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            triggerClassName,
          )}
          aria-label="More actions"
        >
          <Icon name="overflow-dots" size={18} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {items.map((item, index) => {
            const previous = items[index - 1];
            const needsSeparator = index > 0 && !previous.destructive && item.destructive;
            return (
              <div key={item.label}>
                {needsSeparator && <DropdownMenuSeparator />}
                <DropdownMenuItem destructive={item.destructive} onSelect={item.onSelect}>
                  {item.label}
                </DropdownMenuItem>
              </div>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

interface DefaultActionHandlers {
  onEdit?: () => void;
  onPin?: () => void;
  onRestore?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

/**
 * "Delete" is the only destructive verb surfaced here — it soft-archives the
 * entity (recoverable for ~7 days via the Archive screen), so there is no
 * separate, no-confirmation "Archive" action anymore.
 */
function buildDefaultActions(
  entityType: EntityType,
  handlers: DefaultActionHandlers,
): EntityOverflowAction[] {
  const { onEdit, onPin, onRestore, onDelete, onDuplicate } = handlers;
  const result: EntityOverflowAction[] = [];

  // Pin first — it's the quick-access action and the only way keyboard/touch
  // users can pin an item, since dragging is mouse-only.
  if (onPin) result.push({ label: "Pin to sidebar", onSelect: onPin });

  if (onEdit) result.push({ label: "Edit", onSelect: onEdit });

  // Duplicate makes sense for projects/collections/notes, not single resources.
  if (onDuplicate && entityType !== "resource") {
    result.push({ label: "Duplicate", onSelect: onDuplicate });
  }

  if (onRestore) result.push({ label: "Restore", onSelect: onRestore });

  if (onDelete) {
    const label = entityType === "collection" ? "Delete collection" : "Delete";
    result.push({ label, onSelect: onDelete, destructive: true });
  }

  return result;
}

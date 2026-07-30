import { Icon } from "@/design-system/icons/Icon";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { ChecklistItem } from "@/types/entities";

export interface ChecklistItemsFieldProps {
  value: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
  id?: string;
}

/** Cap on checklist length — keeps the note focused and the list scannable. */
const MAX_ITEMS = 10;

/**
 * Editable checklist repeater. Each item reuses the platform's layered "soft"
 * field treatment (a white card raised inside a thin #F9F9F8 frame — same as
 * PropertyDropdown's Category/Status controls): the checkbox + text sit on the
 * white layer, while the remove ✕ lives in the frame's right gutter. The
 * trailing "Add item" row is a dashed-outline affordance that appends a new
 * item, hidden once the list hits `MAX_ITEMS`.
 */
export function ChecklistItemsField({ value, onChange, id }: ChecklistItemsFieldProps) {
  const updateAt = (index: number, patch: Partial<ChecklistItem>) => {
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const add = () => {
    if (value.length >= MAX_ITEMS) return;
    onChange([...value, { text: "", done: false }]);
  };

  return (
    <div className="flex flex-col gap-2.5" id={id}>
      {value.map((item, index) => (
        <div
          key={index}
          className="flex h-[52px] items-center gap-1 rounded-[16px] bg-[#F9F9F8] p-1"
        >
          {/* White raised layer — checkbox + editable text. */}
          <div className="flex h-full flex-1 items-center gap-2.5 rounded-[12px] bg-white px-3">
            <Checkbox
              checked={item.done}
              onCheckedChange={(checked) => updateAt(index, { done: checked === true })}
              aria-label={`Mark item ${index + 1} done`}
              className="h-[20px] w-[20px] rounded-[6px]"
            />
            <input
              value={item.text}
              onChange={(event) => updateAt(index, { text: event.target.value })}
              placeholder={`Item ${index + 1}`}
              aria-label={`Checklist item ${index + 1}`}
              className={cn(
                "min-w-0 flex-1 bg-transparent text-[15px] font-medium text-text-primary placeholder:font-normal placeholder:text-text-tertiary focus:outline-none",
                item.done && "text-text-tertiary line-through",
              )}
            />
          </div>
          {/* Remove ✕ in the frame's right gutter. */}
          <button
            type="button"
            onClick={() => removeAt(index)}
            aria-label="Remove item"
            className="flex h-full w-9 shrink-0 items-center justify-center rounded-[12px] text-text-tertiary transition-colors duration-fast ease-out hover:text-blush-600"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      ))}

      {value.length < MAX_ITEMS && (
        <button
          type="button"
          onClick={add}
          className="flex h-[52px] items-center gap-2.5 rounded-[16px] border border-dashed border-[#E0DFDD] px-4 text-left text-text-tertiary transition-colors duration-fast ease-out hover:border-[#CFCEC9] hover:bg-[#F9F9F8]/60"
        >
          <span
            aria-hidden
            className="h-[20px] w-[20px] shrink-0 rounded-[6px] border border-border-default"
          />
          <span className="flex-1 text-[15px]">Add item</span>
          <Icon name="plus" size={18} className="shrink-0" />
        </button>
      )}
    </div>
  );
}

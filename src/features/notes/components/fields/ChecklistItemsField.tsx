import { Icon } from "@/design-system/icons/Icon";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ChecklistItem } from "@/types/entities";

export interface ChecklistItemsFieldProps {
  value: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
  id?: string;
}

/**
 * Editable checklist repeater — each row is a real checkbox + text input, so
 * items can be checked off and renamed in place. Visually mirrors the
 * read-only `ChecklistBody` on `NoteCard`, but interactive.
 */
export function ChecklistItemsField({ value, onChange, id }: ChecklistItemsFieldProps) {
  const updateAt = (index: number, patch: Partial<ChecklistItem>) => {
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const add = () => onChange([...value, { text: "", done: false }]);

  return (
    <div className="flex flex-col gap-2" id={id}>
      {value.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Checkbox
            checked={item.done}
            onCheckedChange={(checked) => updateAt(index, { done: checked === true })}
            aria-label={`Mark item ${index + 1} done`}
          />
          <Input
            size="sm"
            value={item.text}
            onChange={(event) => updateAt(index, { text: event.target.value })}
            placeholder={`Item ${index + 1}`}
            aria-label={`Checklist item ${index + 1}`}
            className={cn(item.done && "text-text-tertiary line-through")}
          />
          <button
            type="button"
            onClick={() => removeAt(index)}
            aria-label="Remove item"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-chip text-text-tertiary transition-colors duration-fast ease-out hover:bg-cream-100 hover:text-blush-600"
          >
            <Icon name="close" size={15} />
          </button>
        </div>
      ))}
      <Button type="button" variant="ghost" size="sm" onClick={add} className="self-start">
        <Icon name="plus" size={15} />
        Add item
      </Button>
    </div>
  );
}

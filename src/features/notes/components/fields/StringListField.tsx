import { Icon } from "@/design-system/icons/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface StringListFieldProps {
  value: string[];
  onChange: (items: string[]) => void;
  itemLabel: string;
  addLabel: string;
  id?: string;
}

/**
 * Repeater for a plain string array — used by Recipe's ingredients and
 * Meeting's agenda. Mirrors the `ExternalLinksField` repeater pattern.
 */
export function StringListField({ value, onChange, itemLabel, addLabel, id }: StringListFieldProps) {
  const updateAt = (index: number, text: string) => {
    onChange(value.map((item, i) => (i === index ? text : item)));
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const add = () => onChange([...value, ""]);

  return (
    <div className="flex flex-col gap-2" id={id}>
      {value.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            size="sm"
            value={item}
            onChange={(event) => updateAt(index, event.target.value)}
            placeholder={`${itemLabel} ${index + 1}`}
            aria-label={`${itemLabel} ${index + 1}`}
          />
          <button
            type="button"
            onClick={() => removeAt(index)}
            aria-label={`Remove ${itemLabel.toLowerCase()}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-chip text-text-tertiary transition-colors duration-fast ease-out hover:bg-cream-100 hover:text-blush-600"
          >
            <Icon name="close" size={15} />
          </button>
        </div>
      ))}
      <Button type="button" variant="ghost" size="sm" onClick={add} className="self-start">
        <Icon name="plus" size={15} />
        {addLabel}
      </Button>
    </div>
  );
}

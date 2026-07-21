import { Icon } from "@/design-system/icons/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ExternalLink } from "@/types/entities";

export interface ExternalLinksFieldProps {
  value: ExternalLink[];
  onChange: (links: ExternalLink[]) => void;
  id?: string;
}

/**
 * Repeater for a project's external links (Figma, GitHub, Demo, ...).
 * Kept local to the projects feature — Inspiration/Resources don't carry
 * this field per docs/DATABASE.md, so it isn't a shared/ candidate yet.
 */
export function ExternalLinksField({ value, onChange, id }: ExternalLinksFieldProps) {
  const updateAt = (index: number, patch: Partial<ExternalLink>) => {
    onChange(value.map((link, i) => (i === index ? { ...link, ...patch } : link)));
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const add = () => onChange([...value, { label: "", url: "" }]);

  return (
    <div className="flex flex-col gap-2" id={id}>
      {value.map((link, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={link.label}
            onChange={(event) => updateAt(index, { label: event.target.value })}
            placeholder="Label (e.g. Figma)"
            aria-label={`External link ${index + 1} label`}
            className="w-[140px] shrink-0"
          />
          <Input
            value={link.url}
            onChange={(event) => updateAt(index, { url: event.target.value })}
            placeholder="https://…"
            type="url"
            aria-label={`External link ${index + 1} URL`}
          />
          <button
            type="button"
            onClick={() => removeAt(index)}
            aria-label="Remove link"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-chip text-text-tertiary transition-colors duration-fast ease-out hover:bg-cream-100 hover:text-blush-600"
          >
            <Icon name="close" size={15} />
          </button>
        </div>
      ))}
      <Button type="button" variant="ghost" size="sm" onClick={add} className="self-start">
        <Icon name="plus" size={15} />
        Add link
      </Button>
    </div>
  );
}

import { useState, type KeyboardEvent } from "react";
import { Icon } from "@/design-system/icons/Icon";

export interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  id?: string;
  "aria-describedby"?: string;
}

/**
 * Reusable tag editor — Projects, Inspiration boards, and Resources all
 * carry a `tags: string[]` field (docs/DATABASE.md), so this lives in
 * shared/ rather than the projects feature even though Projects is its
 * first caller.
 */
export function TagInput({
  value,
  onChange,
  placeholder = "Add a tag…",
  maxTags = 20,
  id,
  ...rest
}: TagInputProps) {
  const [draft, setDraft] = useState("");

  const commitDraft = () => {
    const next = draft.trim();
    setDraft("");
    if (!next) return;
    if (value.some((tag) => tag.toLowerCase() === next.toLowerCase())) return;
    if (value.length >= maxTags) return;
    onChange([...value, next]);
  };

  const removeTag = (tag: string) => onChange(value.filter((existing) => existing !== tag));

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitDraft();
    } else if (event.key === "Backspace" && draft === "" && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-button border border-transparent bg-cream-100/60 px-3 py-2.5 transition-shadow duration-fast ease-out focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-ring">
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-chip bg-sage-100 px-2.5 py-1.5 text-[12.5px] font-medium text-sage-900"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            aria-label={`Remove tag ${tag}`}
            className="flex h-4 w-4 items-center justify-center rounded-chip text-sage-700 transition-colors duration-fast ease-out hover:bg-sage-200 hover:text-sage-900"
          >
            <Icon name="close" size={9} />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commitDraft}
        placeholder={value.length === 0 ? placeholder : undefined}
        disabled={value.length >= maxTags}
        className="min-w-[80px] flex-1 bg-transparent text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none disabled:cursor-not-allowed"
        {...rest}
      />
    </div>
  );
}

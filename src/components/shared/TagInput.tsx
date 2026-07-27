import { useEffect, useState, type KeyboardEvent } from "react";
import { Icon } from "@/design-system/icons/Icon";
import { cn } from "@/lib/utils";

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
  // Removal is immediate in `value` (so a save mid-transition can't resurrect
  // a "removed" tag) — `fadingTags` only keeps the chip rendered a moment
  // longer, purely for the fade+scale-out.
  const [fadingTags, setFadingTags] = useState<string[]>([]);

  // Drop any fading tag that came back (e.g. external reset of `value`).
  useEffect(() => {
    setFadingTags((current) => current.filter((tag) => !value.includes(tag)));
  }, [value]);

  const commitDraft = () => {
    const next = draft.trim();
    setDraft("");
    if (!next) return;
    if (value.some((tag) => tag.toLowerCase() === next.toLowerCase())) return;
    if (value.length >= maxTags) return;
    onChange([...value, next]);
  };

  /** Removes the tag from `value` immediately; the chip itself lingers
   * briefly via `fadingTags` to play a fade+scale-out. */
  const removeTag = (tag: string) => {
    onChange(value.filter((existing) => existing !== tag));
    setFadingTags((current) => [...current, tag]);
    window.setTimeout(() => {
      setFadingTags((current) => current.filter((existing) => existing !== tag));
    }, 160);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitDraft();
    } else if (event.key === "Backspace" && draft === "" && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const displayTags = [...value, ...fadingTags.filter((tag) => !value.includes(tag))];

  return (
    <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-button border border-transparent bg-cream-100/60 px-3 py-2.5 transition-shadow duration-fast ease-out focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-ring">
      {displayTags.map((tag) => {
        const fading = !value.includes(tag);
        return (
          <span
            key={tag}
            className={cn(
              "inline-flex items-center gap-1 rounded-chip bg-sage-100 px-2.5 py-1.5 text-[12.5px] font-medium text-sage-900 transition-all duration-fast ease-out",
              fading ? "scale-90 opacity-0" : "scale-100 opacity-100",
            )}
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              disabled={fading}
              aria-label={`Remove tag ${tag}`}
              className="flex h-4 w-4 items-center justify-center rounded-chip text-sage-700 transition-colors duration-fast ease-out hover:bg-sage-200 hover:text-sage-900"
            >
              <Icon name="close" size={9} />
            </button>
          </span>
        );
      })}
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

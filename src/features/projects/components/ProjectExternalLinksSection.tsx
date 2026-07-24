import { useState } from "react";
import { Icon } from "@/design-system/icons/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ExternalLink } from "@/types/entities";
import { ProjectSection } from "./ProjectSection";

export interface ProjectExternalLinksSectionProps {
  links: ExternalLink[];
  editMode: boolean;
  onChange: (links: ExternalLink[]) => void;
}

/** External links surfaced as their own page-body section (previously sidebar-only). */
export function ProjectExternalLinksSection({
  links,
  editMode,
  onChange,
}: ProjectExternalLinksSectionProps) {
  const [adding, setAdding] = useState(false);
  const [draftUrl, setDraftUrl] = useState("");
  const [draftLabel, setDraftLabel] = useState("");

  const removeAt = (index: number) => onChange(links.filter((_, i) => i !== index));

  const commitDraft = () => {
    if (!draftUrl.trim()) return;
    onChange([...links, { url: draftUrl.trim(), label: draftLabel.trim() || draftUrl.trim() }]);
    setDraftUrl("");
    setDraftLabel("");
    setAdding(false);
  };

  return (
    <ProjectSection
      eyebrow="External links"
      tone="solid"
      headerAction={
        editMode &&
        !adding && (
          <Button type="button" variant="ghost" size="sm" onClick={() => setAdding(true)}>
            <Icon name="plus" size={15} />
            Add link
          </Button>
        )
      }
    >
      <div className="flex flex-col gap-2">
        {links.length === 0 && !adding && (
          <p className="text-[13px] text-text-tertiary">No external links yet.</p>
        )}

        {links.map((link, index) => (
          <div
            key={`${link.url}-${index}`}
            className="flex items-center gap-3 rounded-chip border border-border-subtle bg-surface-card/60 px-3 py-2.5"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-chip bg-cream-100 text-text-tertiary">
              <Icon name="link" size={15} />
            </span>
            <span className="flex-1 truncate text-[14px] text-text-primary">{link.label}</span>
            {editMode ? (
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label="Remove link"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-chip text-text-tertiary transition-colors duration-fast ease-out hover:bg-cream-100 hover:text-blush-600"
              >
                <Icon name="close" size={15} />
              </button>
            ) : (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${link.label}`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-chip text-text-tertiary transition-colors duration-fast ease-out hover:bg-cream-100 hover:text-text-primary"
              >
                <Icon name="external-link" size={15} />
              </a>
            )}
          </div>
        ))}

        {adding && (
          <div className="flex items-center gap-2 rounded-chip border border-border-subtle px-3 py-2">
            <Input
              value={draftUrl}
              onChange={(event) => setDraftUrl(event.target.value)}
              placeholder="https://…"
              type="url"
              aria-label="New link URL"
              className="flex-1"
            />
            <Input
              value={draftLabel}
              onChange={(event) => setDraftLabel(event.target.value)}
              placeholder="Label (optional)"
              aria-label="New link label"
              className="w-[160px] shrink-0"
            />
            <button
              type="button"
              onClick={commitDraft}
              aria-label="Save link"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-chip bg-sage-900 text-cream-50 transition-colors duration-fast ease-out hover:bg-sage-700"
            >
              <Icon name="check" size={15} />
            </button>
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setDraftUrl("");
                setDraftLabel("");
              }}
              aria-label="Cancel adding link"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-chip border border-border-default text-text-tertiary transition-colors duration-fast ease-out hover:bg-cream-100"
            >
              <Icon name="close" size={15} />
            </button>
          </div>
        )}
      </div>
    </ProjectSection>
  );
}

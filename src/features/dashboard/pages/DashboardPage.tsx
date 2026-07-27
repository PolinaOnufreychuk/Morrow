import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DESIGNER_NAME } from "../dashboard.fixtures";
import { HeroGreeting } from "../components/HeroGreeting";
import { QuickActions } from "../components/QuickActions";
import { LatestRow } from "../components/LatestRow";
import { ProjectCreateModal } from "@/features/projects/components/ProjectCreateModal";
import { BoardCreateModal } from "@/features/inspiration/components/BoardCreateModal";
import { NoteTypePickerModal } from "@/features/notes/components/NoteTypePickerModal";
import { NoteEditorModal } from "@/features/notes/components/NoteEditorModal";
import { ResourceCreateModal } from "@/features/resources/components/ResourceCreateModal";
import { ResourcePreviewModal } from "@/features/resources/components/ResourcePreviewModal";
import type { Note, NoteType, Resource } from "@/types/entities";

function formatToday(): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
    .format(new Date())
    .replace(",", " ·");
}

/**
 * Dashboard — the hi-fi reference screen (Dashboard.dc.html). Centered
 * editorial hero (date eyebrow, Canela greeting, glass search, four equal
 * quick actions), directly followed by the four bespoke "Latest" cards
 * (Project, Note, Inspiration, Resource) — no module tabs, no sort control.
 */
export function DashboardPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  // Quick-action creation modals
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [createBoardOpen, setCreateBoardOpen] = useState(false);
  const [notePickerOpen, setNotePickerOpen] = useState(false);
  const [createResourceOpen, setCreateResourceOpen] = useState(false);

  // New-note flow: type picker → editor
  const [editorNoteType, setEditorNoteType] = useState<NoteType | null>(null);

  // Note/Resource preview popups opened from the Latest row
  const [previewNote, setPreviewNote] = useState<Note | null>(null);
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);

  const openNoteEditorFor = (type: NoteType) => {
    setNotePickerOpen(false);
    setEditorNoteType(type);
  };

  return (
    <div className="relative z-[1] mx-auto mb-5 mt-5 max-w-[1360px] px-[clamp(32px,5vw,72px)] pb-24">
      {/* Hero */}
      <header className="flex flex-col items-center gap-[13px] px-0 pb-5 pt-[72px] text-center">
        <HeroGreeting name={DESIGNER_NAME} dateLabel={formatToday()} />

        <form
          onSubmit={(event) => {
            event.preventDefault();
            const trimmed = query.trim();
            if (trimmed) navigate(`/search?q=${encodeURIComponent(trimmed)}`);
          }}
          className="mt-5 flex h-12 w-[min(560px,100%)] items-center gap-3 rounded-[16px] border border-white/65 px-[18px] shadow-[0_1px_2px_hsl(30_25%_20%_/_.05),0_16px_40px_-16px_hsl(30_25%_20%_/_.16)] backdrop-blur-[14px] backdrop-saturate-[1.2] transition-[box-shadow,border-color] duration-200 focus-within:border-brand-primary focus-within:shadow-[0_0_0_4px_var(--focus-ring),0_16px_40px_-16px_hsl(30_25%_20%_/_.16)]"
          style={{ background: "rgba(255,255,255,.55)" }}
        >
          <button type="submit" className="flex flex-shrink-0 text-text-tertiary" aria-label="Search">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m20 20-3.6-3.6" />
            </svg>
          </button>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search everything…"
            className="flex-1 border-none bg-transparent text-[14px] text-text-primary outline-none placeholder:text-text-tertiary"
          />
          <span className="flex flex-shrink-0 items-center gap-0.5 rounded-chip bg-ink-900/[.06] px-2 py-1 text-[11px] font-medium text-text-tertiary">
            ⌘K
          </span>
        </form>

        <QuickActions
          onNewProject={() => setCreateProjectOpen(true)}
          onNewInspiration={() => setCreateBoardOpen(true)}
          onNewNote={() => setNotePickerOpen(true)}
          onNewResource={() => setCreateResourceOpen(true)}
        />
      </header>

      {/* Latest — four bespoke cards, straight from hero to content */}
      <LatestRow
        onPreviewNote={setPreviewNote}
        onPreviewResource={setPreviewResource}
        onCreateProject={() => setCreateProjectOpen(true)}
        onCreateBoard={() => setCreateBoardOpen(true)}
        onCreateNote={() => setNotePickerOpen(true)}
        onCreateResource={() => setCreateResourceOpen(true)}
      />

      {/* Quick-action creation modals */}
      <ProjectCreateModal open={createProjectOpen} onOpenChange={setCreateProjectOpen} />
      <BoardCreateModal open={createBoardOpen} onOpenChange={setCreateBoardOpen} />
      <NoteTypePickerModal
        open={notePickerOpen}
        onOpenChange={setNotePickerOpen}
        onSelectType={openNoteEditorFor}
      />
      <ResourceCreateModal open={createResourceOpen} onOpenChange={setCreateResourceOpen} />

      {editorNoteType && (
        <NoteEditorModal
          open={editorNoteType !== null}
          onOpenChange={(open) => !open && setEditorNoteType(null)}
          type={editorNoteType}
        />
      )}

      {/* Preview popups opened from the Latest row */}
      {previewNote && (
        <NoteEditorModal
          open={previewNote !== null}
          onOpenChange={(open) => !open && setPreviewNote(null)}
          note={previewNote}
          type={previewNote.type}
        />
      )}
      <ResourcePreviewModal
        resource={previewResource}
        open={previewResource !== null}
        onOpenChange={(open) => !open && setPreviewResource(null)}
      />
    </div>
  );
}

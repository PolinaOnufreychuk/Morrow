import { type ReactNode, useMemo, useState } from "react";
import { cn, sortByRecency } from "@/lib/utils";
import { DESIGNER_NAME } from "../dashboard.fixtures";
import { HeroGreeting } from "../components/HeroGreeting";
import { QuickActions } from "../components/QuickActions";
import { LatestRow } from "../components/LatestRow";
import { SortSelect } from "@/components/shared/SortSelect";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { notify } from "@/components/shared/Toast";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import { ProjectCreateModal } from "@/features/projects/components/ProjectCreateModal";
import { ProjectEditModal } from "@/features/projects/components/ProjectEditModal";
import { useArchiveProject, useDeleteProject, useProjects } from "@/features/projects/hooks/useProjects";
import { InspirationCard } from "@/features/inspiration/components/InspirationCard";
import { BoardCreateModal } from "@/features/inspiration/components/BoardCreateModal";
import { BoardEditModal } from "@/features/inspiration/components/BoardEditModal";
import { useArchiveBoard, useBoards } from "@/features/inspiration/hooks/useInspiration";
import { NoteCard } from "@/features/notes/components/NoteCard";
import { NoteTypePickerModal } from "@/features/notes/components/NoteTypePickerModal";
import { NoteEditorModal } from "@/features/notes/components/NoteEditorModal";
import { useArchiveNote, useDeleteNote, useNotes } from "@/features/notes/hooks/useNotes";
import { ResourceCard } from "@/features/resources/components/ResourceCard";
import { ResourceCreateModal } from "@/features/resources/components/ResourceCreateModal";
import { ResourceEditModal } from "@/features/resources/components/ResourceEditModal";
import { useArchiveResource, useDeleteResource, useResources } from "@/features/resources/hooks/useResources";
import type { InspirationBoard, Note, NoteType, Project, Resource } from "@/types/entities";

const TABS = ["Latest", "Projects", "Inspiration", "Notes", "Resources"] as const;
type Tab = (typeof TABS)[number];
type SortMode = "recent" | "title";

const SORT_OPTIONS = [
  { value: "recent" as SortMode, label: "Recently updated" },
  { value: "title" as SortMode, label: "Name" },
];

function byRecentOrTitle<T extends { title: string; updatedAt: string }>(
  items: T[],
  sort: SortMode,
): T[] {
  return sort === "title" ? [...items].sort((a, b) => a.title.localeCompare(b.title)) : sortByRecency(items);
}

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
 * quick actions), a segmented module control + sort, then either the four
 * bespoke "Latest" cards or a masonry feed for the selected module — backed
 * by the same live data/hooks each module's own page uses, not fixtures.
 */
export function DashboardPage() {
  const [tab, setTab] = useState<Tab>("Latest");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("recent");

  // Quick-action creation modals
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [createBoardOpen, setCreateBoardOpen] = useState(false);
  const [notePickerOpen, setNotePickerOpen] = useState(false);
  const [createResourceOpen, setCreateResourceOpen] = useState(false);

  // Per-entity edit/delete state, mirroring each module's own page
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [pendingDeleteProject, setPendingDeleteProject] = useState<Project | null>(null);
  const [editingBoard, setEditingBoard] = useState<InspirationBoard | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editorNoteType, setEditorNoteType] = useState<NoteType | null>(null);
  const [pendingDeleteNote, setPendingDeleteNote] = useState<Note | null>(null);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [pendingDeleteResource, setPendingDeleteResource] = useState<Resource | null>(null);

  const { data: projects = [] } = useProjects();
  const { data: boards = [] } = useBoards();
  const { data: notes = [] } = useNotes();
  const { data: resources = [] } = useResources();

  const archiveProject = useArchiveProject();
  const deleteProject = useDeleteProject();
  const archiveBoard = useArchiveBoard();
  const archiveNote = useArchiveNote();
  const deleteNote = useDeleteNote();
  const archiveResource = useArchiveResource();
  const deleteResource = useDeleteResource();

  const sortedProjects = useMemo(() => byRecentOrTitle(projects, sort), [projects, sort]);
  const sortedBoards = useMemo(() => byRecentOrTitle(boards, sort), [boards, sort]);
  const sortedNotes = useMemo(() => byRecentOrTitle(notes, sort), [notes, sort]);
  const sortedResources = useMemo(() => byRecentOrTitle(resources, sort), [resources, sort]);

  const openNoteEditorFor = (type: NoteType) => {
    setNotePickerOpen(false);
    setEditingNote(null);
    setEditorNoteType(type);
  };

  const editNote = (note: Note) => {
    setEditingNote(note);
    setEditorNoteType(note.type);
  };

  return (
    <div className="relative z-[1] mx-auto mb-5 mt-5 max-w-[1360px] px-[clamp(32px,5vw,72px)] pb-24">
      {/* Hero */}
      <header className="flex flex-col items-center gap-[13px] px-0 pb-5 pt-[72px] text-center">
        <HeroGreeting name={DESIGNER_NAME} dateLabel={formatToday()} />

        <label
          className="mt-5 flex h-12 w-[min(560px,100%)] items-center gap-3 rounded-[16px] border border-white/65 px-[18px] shadow-[0_1px_2px_hsl(30_25%_20%_/_.05),0_16px_40px_-16px_hsl(30_25%_20%_/_.16)] backdrop-blur-[14px] backdrop-saturate-[1.2] transition-[box-shadow,border-color] duration-200 focus-within:border-brand-primary focus-within:shadow-[0_0_0_4px_var(--focus-ring),0_16px_40px_-16px_hsl(30_25%_20%_/_.16)]"
          style={{ background: "rgba(255,255,255,.55)" }}
        >
          <span className="flex flex-shrink-0 text-text-tertiary">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m20 20-3.6-3.6" />
            </svg>
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search everything…"
            className="flex-1 border-none bg-transparent text-[14px] text-text-primary outline-none placeholder:text-text-tertiary"
          />
          <span className="flex flex-shrink-0 items-center gap-0.5 rounded-chip bg-ink-900/[.06] px-2 py-1 text-[11px] font-medium text-text-tertiary">
            ⌘K
          </span>
        </label>

        <QuickActions
          onNewProject={() => setCreateProjectOpen(true)}
          onNewInspiration={() => setCreateBoardOpen(true)}
          onNewNote={() => setNotePickerOpen(true)}
          onNewResource={() => setCreateResourceOpen(true)}
        />
      </header>

      {/* Module control + sort */}
      <div className="mt-2 flex items-center justify-between gap-4">
        <div
          className="inline-flex gap-0.5 rounded-[13px] p-1 backdrop-blur-[14px]"
          style={{ background: "rgba(255,255,255,.42)" }}
          role="tablist"
        >
          {TABS.map((item) => {
            const active = item === tab;
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(item)}
                className={cn(
                  "rounded-[9px] px-4 py-2 text-[12.5px] transition-[background,color] duration-[160ms]",
                  active
                    ? "bg-white/90 font-medium text-text-primary shadow-[0_2px_8px_-4px_hsl(30_25%_20%_/_.25)]"
                    : "font-normal text-text-secondary hover:text-text-primary",
                )}
              >
                {item}
              </button>
            );
          })}
        </div>

        {tab !== "Latest" && (
          <SortSelect
            options={SORT_OPTIONS}
            value={sort}
            onValueChange={setSort}
            className="h-9 w-[172px] rounded-[13px] border-white/55 bg-white/50 text-[12.5px] text-text-secondary backdrop-blur-[14px]"
          />
        )}
      </div>

      {/* Content */}
      <div key={tab} className="animate-ref-fade-in">
        {tab === "Latest" ? (
          <LatestRow />
        ) : (
          <div className="masonry3 mt-10">
            {tab === "Projects" &&
              sortedProjects.map((project) => (
                <MasonryItem key={project.id}>
                  <ProjectCard
                    project={project}
                    variant="full"
                    onEdit={setEditingProject}
                    onArchive={(target) =>
                      archiveProject.mutate(target.id, {
                        onSuccess: () => notify.success(`"${target.title}" archived`),
                        onError: () => notify.error("Couldn't archive this project."),
                      })
                    }
                    onDelete={setPendingDeleteProject}
                  />
                </MasonryItem>
              ))}
            {tab === "Inspiration" &&
              sortedBoards.map((board) => (
                <MasonryItem key={board.id}>
                  <InspirationCard
                    board={board}
                    variant="full"
                    onEdit={setEditingBoard}
                    onArchive={(target) =>
                      archiveBoard.mutate(target.id, {
                        onSuccess: () => notify.success(`"${target.title}" archived`),
                        onError: () => notify.error("Couldn't archive this board."),
                      })
                    }
                  />
                </MasonryItem>
              ))}
            {tab === "Notes" &&
              sortedNotes.map((note) => (
                <MasonryItem key={note.id}>
                  <NoteCard
                    note={note}
                    variant="full"
                    onEdit={editNote}
                    onArchive={(target) =>
                      archiveNote.mutate(target.id, {
                        onSuccess: () => notify.success(`"${target.title}" archived`),
                        onError: () => notify.error("Couldn't archive this note."),
                      })
                    }
                    onDelete={setPendingDeleteNote}
                  />
                </MasonryItem>
              ))}
            {tab === "Resources" &&
              sortedResources.map((resource) => (
                <MasonryItem key={resource.id}>
                  <ResourceCard
                    resource={resource}
                    variant="full"
                    onEdit={setEditingResource}
                    onArchive={(target) =>
                      archiveResource.mutate(target.id, {
                        onSuccess: () => notify.success(`"${target.title}" archived`),
                        onError: () => notify.error("Couldn't archive this resource."),
                      })
                    }
                    onDelete={setPendingDeleteResource}
                  />
                </MasonryItem>
              ))}
          </div>
        )}
      </div>

      {/* Quick-action creation modals */}
      <ProjectCreateModal open={createProjectOpen} onOpenChange={setCreateProjectOpen} />
      <BoardCreateModal open={createBoardOpen} onOpenChange={setCreateBoardOpen} />
      <NoteTypePickerModal
        open={notePickerOpen}
        onOpenChange={setNotePickerOpen}
        onSelectType={openNoteEditorFor}
      />
      <ResourceCreateModal open={createResourceOpen} onOpenChange={setCreateResourceOpen} />

      {/* Edit modals */}
      {editingProject && (
        <ProjectEditModal
          open={editingProject !== null}
          onOpenChange={(open) => !open && setEditingProject(null)}
          project={editingProject}
        />
      )}
      {editingBoard && (
        <BoardEditModal
          open={editingBoard !== null}
          onOpenChange={(open) => !open && setEditingBoard(null)}
          board={editingBoard}
        />
      )}
      {editorNoteType && (
        <NoteEditorModal
          open={editorNoteType !== null}
          onOpenChange={(open) => {
            if (!open) {
              setEditorNoteType(null);
              setEditingNote(null);
            }
          }}
          note={editingNote ?? undefined}
          type={editorNoteType}
        />
      )}
      {editingResource && (
        <ResourceEditModal
          open={editingResource !== null}
          onOpenChange={(open) => !open && setEditingResource(null)}
          resource={editingResource}
        />
      )}

      {/* Delete confirmations */}
      <ConfirmDialog
        open={pendingDeleteProject !== null}
        onOpenChange={(open) => !open && setPendingDeleteProject(null)}
        title="Delete project?"
        description={
          pendingDeleteProject
            ? `"${pendingDeleteProject.title}" and its links to inspiration, notes, and resources will be permanently removed.`
            : undefined
        }
        confirmLabel="Delete project"
        pendingLabel="Deleting…"
        destructive
        onConfirm={async () => {
          if (!pendingDeleteProject) return;
          await deleteProject.mutateAsync(pendingDeleteProject.id);
          notify.success(`"${pendingDeleteProject.title}" deleted`);
        }}
      />
      <ConfirmDialog
        open={pendingDeleteNote !== null}
        onOpenChange={(open) => !open && setPendingDeleteNote(null)}
        title="Delete note?"
        description={pendingDeleteNote ? `"${pendingDeleteNote.title}" will be permanently removed.` : undefined}
        confirmLabel="Delete note"
        pendingLabel="Deleting…"
        destructive
        onConfirm={async () => {
          if (!pendingDeleteNote) return;
          await deleteNote.mutateAsync(pendingDeleteNote.id);
          notify.success(`"${pendingDeleteNote.title}" deleted`);
        }}
      />
      <ConfirmDialog
        open={pendingDeleteResource !== null}
        onOpenChange={(open) => !open && setPendingDeleteResource(null)}
        title="Delete resource?"
        description={
          pendingDeleteResource ? `"${pendingDeleteResource.title}" will be removed from Resources.` : undefined
        }
        confirmLabel="Delete resource"
        pendingLabel="Deleting…"
        destructive
        onConfirm={async () => {
          if (!pendingDeleteResource) return;
          await deleteResource.mutateAsync(pendingDeleteResource.id);
          notify.success(`"${pendingDeleteResource.title}" deleted`);
        }}
      />
    </div>
  );
}

function MasonryItem({ children }: { children: ReactNode }) {
  return <div className="masonry-item">{children}</div>;
}

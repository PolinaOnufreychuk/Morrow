import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageShell } from "@/components/shared/PageShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { SearchModuleFilterPopover } from "../components/SearchModuleFilterPopover";
import { EmptyState } from "@/components/shared/EmptyState";
import { EmptyStateIllustration } from "@/components/shared/EmptyStateIllustration";
import { NoSearchResultsState } from "@/components/shared/NoSearchResultsState";
import { BackLink } from "@/components/shared/BackLink";
import { searchWorkspace } from "@/lib/search";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import { useBoards } from "@/features/inspiration/hooks/useInspiration";
import { InspirationCard } from "@/features/inspiration/components/InspirationCard";
import { useNotes } from "@/features/notes/hooks/useNotes";
import { NoteCard } from "@/features/notes/components/NoteCard";
import { NoteEditorModal } from "@/features/notes/components/NoteEditorModal";
import type { Note } from "@/types/entities";
import { useResources } from "@/features/resources/hooks/useResources";
import { ResourceCard } from "@/features/resources/components/ResourceCard";

type ResultTab = "all" | "projects" | "inspiration" | "notes" | "resources";

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [inputValue, setInputValue] = useState(query);
  const [tab, setTab] = useState<ResultTab>("all");
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const { data: projects = [] } = useProjects();
  const { data: boards = [] } = useBoards();
  const { data: notes = [] } = useNotes();
  const { data: resources = [] } = useResources();

  const results = useMemo(
    () => searchWorkspace(query, { projects, boards, notes, resources }),
    [query, projects, boards, notes, resources],
  );

  const total = results.projects.length + results.boards.length + results.notes.length + results.resources.length;

  const backContext = {
    path: `/search?${searchParams.toString()}`,
    label: "Search results",
  };

  const submitSearch = () => {
    const trimmed = inputValue.trim();
    setSearchParams(trimmed ? { q: trimmed } : {});
  };

  const showProjects = tab === "all" || tab === "projects";
  const showInspiration = tab === "all" || tab === "inspiration";
  const showNotes = tab === "all" || tab === "notes";
  const showResources = tab === "all" || tab === "resources";

  const visibleCount =
    (showProjects ? results.projects.length : 0) +
    (showInspiration ? results.boards.length : 0) +
    (showNotes ? results.notes.length : 0) +
    (showResources ? results.resources.length : 0);

  return (
    <PageShell>
      <div className="flex flex-col gap-3">
        <BackLink to="/" label="dashboard" />

        <PageHeader title="Search results" titleClassName="relative top-2 text-[40px]" />

        <div className="flex items-center gap-2">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submitSearch();
            }}
            className="flex-1"
          >
            <SearchInput
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Search everything…"
              variant="flat"
              className="w-full"
            />
          </form>

          <SearchModuleFilterPopover
            options={[
              { value: "all", label: `All (${total})` },
              { value: "projects", label: `Projects (${results.projects.length})` },
              { value: "inspiration", label: `Inspiration (${results.boards.length})` },
              { value: "notes", label: `Notes (${results.notes.length})` },
              { value: "resources", label: `Resources (${results.resources.length})` },
            ]}
            value={tab}
            onValueChange={setTab}
            onClear={() => setTab("all")}
          />
        </div>
      </div>

      {!query ? (
        <EmptyState
          title="Start typing to search your workspace."
          illustration={<EmptyStateIllustration variant="search" />}
        />
      ) : (
        <>
          <p className="text-[13px] text-text-secondary">
            {total} result{total === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
          </p>

          {visibleCount === 0 ? (
            <NoSearchResultsState query={query} />
          ) : (
            <div className="flex flex-col gap-10">
              {showProjects && results.projects.length > 0 && (
                <section className="flex flex-col gap-4">
                  <h2 className="eyebrow text-text-tertiary">Projects</h2>
                  <div className="grid grid-cols-2 gap-4 board:grid-cols-4">
                    {results.projects.map((project) => (
                      <ProjectCard key={project.id} project={project} variant="full" backContext={backContext} />
                    ))}
                  </div>
                </section>
              )}

              {showNotes && results.notes.length > 0 && (
                <section className="flex flex-col gap-4">
                  <h2 className="eyebrow text-text-tertiary">Notes</h2>
                  <div className="masonry4">
                    {results.notes.map((note) => (
                      <div key={note.id} className="masonry-item">
                        <NoteCard note={note} onEdit={setEditingNote} />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {showResources && results.resources.length > 0 && (
                <section className="flex flex-col gap-4">
                  <h2 className="eyebrow text-text-tertiary">Resources</h2>
                  <div className="masonry4">
                    {results.resources.map((resource) => (
                      <div key={resource.id} className="masonry-item">
                        <ResourceCard resource={resource} />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {showInspiration && results.boards.length > 0 && (
                <section className="flex flex-col gap-4">
                  <h2 className="eyebrow text-text-tertiary">Inspiration</h2>
                  <div className="board-grid">
                    {results.boards.map((board) => (
                      <InspirationCard key={board.id} board={board} variant="full" backContext={backContext} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </>
      )}

      {editingNote && (
        <NoteEditorModal
          open={editingNote !== null}
          onOpenChange={(open) => {
            if (!open) setEditingNote(null);
          }}
          note={editingNote}
          type={editingNote.type}
        />
      )}
    </PageShell>
  );
}

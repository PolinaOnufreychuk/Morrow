import { type CSSProperties, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { sortByRecency } from "@/lib/utils";
import { formatRelativeUpdated } from "@/lib/format";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { GithubMark } from "@/design-system/icons/GithubMark";
import { useBoardReferences, useBoards } from "@/features/inspiration/hooks/useInspiration";
import { useNotes } from "@/features/notes/hooks/useNotes";
import { useResources } from "@/features/resources/hooks/useResources";
import type { ChecklistNote, RepoResource, Resource } from "@/types/entities";
import projectCoverFallback from "@/assets/petal-macro-1.png";
import inspirationCoverFallback from "@/assets/lotus-petals-1.png";

/**
 * The "Latest" row — exactly four bespoke 320px cards (Project, Note,
 * Inspiration, Resource) on one line, recreated from Dashboard.dc.html
 * (lines 136–205). Each is a condensed sibling of its full masonry card:
 * same materials, distinct internal identity, recognizable in < 1s without
 * reading the title. Content is the real most-recently-updated item from
 * each module (not hardcoded demo strings) via the same hooks/data the
 * module's own page reads.
 */

const GLASS_SHELL_STYLE: CSSProperties = {
  background: "rgba(255,255,255,.55)",
  backdropFilter: "blur(20px) saturate(1.25)",
  WebkitBackdropFilter: "blur(20px) saturate(1.25)",
  border: "1px solid rgba(255,255,255,.6)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,.6), 0 16px 40px -18px hsl(30 25% 20% / .16)",
};

function PreviewShell({
  children,
  onClick,
  style,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <div
      onClick={onClick}
      className={`group flex h-[320px] cursor-pointer flex-col overflow-hidden rounded-[20px] transition-[transform,box-shadow] duration-[400ms] ease-out hover:-translate-y-[3px] hover:!shadow-[inset_0_1px_0_rgba(255,255,255,.6),0_26px_56px_-18px_hsl(30_25%_20%_/_.2)] ${className ?? ""}`}
      style={{ ...GLASS_SHELL_STYLE, ...style }}
    >
      {children}
    </div>
  );
}

function TypeChip({ label, bg }: { label: string; bg: string }) {
  return (
    <span
      className="inline-flex items-center rounded-chip px-[10px] py-[5px] text-[11px] font-medium leading-none tracking-[.01em] text-text-secondary"
      style={{ background: bg, border: "1px solid transparent" }}
    >
      {label}
    </span>
  );
}

export function LatestRow() {
  const navigate = useNavigate();

  const { data: projects = [] } = useProjects();
  const { data: boards = [] } = useBoards();
  const { data: notes = [] } = useNotes();
  const { data: resources = [] } = useResources();

  const latestProject = sortByRecency(projects)[0];
  const latestBoard = sortByRecency(boards)[0];
  const latestChecklistNote = sortByRecency(
    notes.filter((note): note is ChecklistNote => note.type === "checklist"),
  )[0];
  const latestResource = sortByRecency(resources)[0];

  const { data: boardReferences = [] } = useBoardReferences(latestBoard?.id ?? "");

  return (
    // Per the hi-fi source: exactly 4 cards, one row, never wraps/crushes —
    // horizontal scroll below the 960px floor rather than collapsing columns.
    <div className="mt-10 overflow-x-auto">
      <div className="grid min-w-[960px] grid-cols-4 items-start gap-4">
        {/* Project */}
        {latestProject && (
          <PreviewShell onClick={() => navigate("/projects")} className="gap-2 p-4">
            <div className="flex items-center justify-between px-px">
              <TypeChip label="Project" bg="#FEFFFEE6" />
              <span className="text-[11.5px] text-text-tertiary">
                {formatRelativeUpdated(latestProject.updatedAt)}
              </span>
            </div>
            <div className="flex flex-col gap-1 px-px">
              <span className="text-[16px] font-medium leading-[1.3] text-text-primary">
                {latestProject.title}
              </span>
              {latestProject.description && (
                <span className="clamp1 text-[12.5px] leading-[1.5] text-text-secondary">
                  {latestProject.description}
                </span>
              )}
            </div>
            <div
              className="relative mt-1 flex-1 overflow-hidden rounded-[14px] bg-cover bg-center"
              style={{ backgroundImage: `url(${latestProject.coverImageUrl ?? projectCoverFallback})` }}
            />
          </PreviewShell>
        )}

        {/* Note — latest checklist */}
        {latestChecklistNote && (
          <PreviewShell
            onClick={() => navigate("/notes")}
            className="gap-[9px] px-[18px] py-4"
            style={{
              background: "linear-gradient(168deg,rgba(255,252,243,.78),rgba(255,255,255,.5))",
            }}
          >
            <div className="flex items-center justify-between">
              <TypeChip label="Note" bg="#FEFFFEE6" />
              <span className="text-[11.5px] text-text-tertiary">
                {formatRelativeUpdated(latestChecklistNote.updatedAt)}
              </span>
            </div>
            <span className="font-display text-[22px] font-light italic leading-[1.1] text-text-primary">
              Today&rsquo;s focus
            </span>
            <div className="border-b border-dashed border-ink-900/[.14]" />
            <div className="flex flex-col gap-[9px]">
              {latestChecklistNote.items.slice(0, 4).map((item) => (
                <ChecklistRow key={item.text} done={item.done}>
                  {item.text}
                </ChecklistRow>
              ))}
            </div>
            <span className="mt-auto text-[12px] text-text-tertiary">
              {latestChecklistNote.items.filter((item) => item.done).length} of{" "}
              {latestChecklistNote.items.length} done
            </span>
          </PreviewShell>
        )}

        {/* Inspiration — fanned stack */}
        {latestBoard && (
          <PreviewShell onClick={() => navigate("/inspiration")} className="p-4">
            <div className="flex items-center justify-between">
              <TypeChip label="Inspiration" bg="#F3F6F0FA" />
              <span className="text-[11.5px] text-text-tertiary">{boardReferences.length} items</span>
            </div>
            <div className="relative mb-[13px] mt-2 flex-1">
              <div className="absolute inset-x-[10px] bottom-1 top-[14px] rotate-[3.5deg] rounded-[14px] bg-white/80 shadow-[0_8px_20px_-12px_hsl(30_25%_20%_/_.25)]" />
              <div className="absolute inset-x-[5px] bottom-px top-2 -rotate-2 rounded-[14px] bg-white/95 shadow-[0_6px_16px_-10px_hsl(30_25%_20%_/_.2)]" />
              <div
                className="absolute inset-0 top-px rounded-[14px] bg-cover bg-center shadow-[0_10px_24px_-12px_hsl(30_25%_20%_/_.3)]"
                style={{ backgroundImage: `url(${latestBoard.coverImageUrl ?? inspirationCoverFallback})` }}
              />
            </div>
            <div className="flex flex-col gap-1.5 px-1.5 pb-1.5 pt-0.5">
              <span className="text-[16.5px] font-medium leading-[1.3] text-text-primary">
                {latestBoard.title}
              </span>
              <span className="text-[12px] text-text-tertiary">
                Updated {formatRelativeUpdated(latestBoard.updatedAt).toLowerCase()}
              </span>
            </div>
          </PreviewShell>
        )}

        {/* Resource — GitHub repo preview, or a generic fallback for other kinds */}
        {latestResource && (
          <PreviewShell
            onClick={() => navigate("/resources")}
            className="gap-[11px] px-4 py-[14px]"
          >
            <div className="flex items-center justify-between">
              <TypeChip label="Resource" bg="#EEF1EA" />
              <span className="text-[11.5px] text-text-tertiary">
                Saved {formatRelativeUpdated(latestResource.updatedAt).toLowerCase()}
              </span>
            </div>
            {latestResource.kind === "repo" ? (
              <RepoMedia resource={latestResource} />
            ) : (
              <GenericResourceMedia resource={latestResource} />
            )}
            <div className="flex flex-col gap-1">
              <span className="text-[15.5px] font-medium leading-[1.3] text-text-primary">
                {latestResource.title}
              </span>
              {latestResource.description && (
                <span className="clamp1 text-[12.5px] leading-[1.5] text-text-secondary">
                  {latestResource.description}
                </span>
              )}
            </div>
            <div className="mt-auto flex items-center gap-[13px] text-[12px] text-text-tertiary">
              {latestResource.kind === "repo" ? (
                <>
                  <span className="inline-flex items-center gap-[5px]">
                    <span className="h-2 w-2 rounded-full bg-blush-600" />
                    {latestResource.language ?? "—"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
                      <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z" />
                    </svg>
                    {latestResource.stars ? `${(latestResource.stars / 1000).toFixed(1)}k` : "—"}
                  </span>
                </>
              ) : (
                latestResource.tags[0] && (
                  <span className="inline-flex items-center gap-[5px]">
                    <span className="h-2 w-2 rounded-full bg-blush-600" />
                    {latestResource.tags[0]}
                  </span>
                )
              )}
            </div>
          </PreviewShell>
        )}
      </div>
    </div>
  );
}

function RepoMedia({ resource }: { resource: RepoResource }) {
  return (
    <div className="flex flex-shrink-0 flex-col overflow-hidden rounded-[12px] border border-ink-900/[.07]">
      <div className="flex h-[22px] flex-shrink-0 items-center gap-1 border-b border-ink-900/[.05] bg-white/75 px-[10px]">
        <span className="h-[5px] w-[5px] rounded-full bg-ink-900/[.15]" />
        <span className="h-[5px] w-[5px] rounded-full bg-ink-900/[.15]" />
        <span className="h-[5px] w-[5px] rounded-full bg-ink-900/[.15]" />
      </div>
      <div className="flex h-24 items-center justify-center bg-[#0D1117] text-white">
        <span className="sr-only">{resource.title}</span>
        <GithubMark size={34} />
      </div>
    </div>
  );
}

function GenericResourceMedia({ resource }: { resource: Resource }) {
  return (
    <div className="flex h-24 flex-shrink-0 items-center justify-center rounded-[12px] border border-ink-900/[.07] bg-sage-100">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#557057" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <title>{resource.title}</title>
        <path d="M9 12.5a3.5 3.5 0 0 0 5 3.1l3-3a3.5 3.5 0 0 0-5-5l-1.2 1.2" />
        <path d="M15 11.5a3.5 3.5 0 0 0-5-3.1l-3 3a3.5 3.5 0 0 0 5 5l1.2-1.2" />
      </svg>
    </div>
  );
}

function ChecklistRow({ children, done = false }: { children: ReactNode; done?: boolean }) {
  return (
    <div className="flex items-center gap-[10px]">
      {done ? (
        <span className="flex h-[17px] w-[17px] flex-shrink-0 items-center justify-center rounded-[5px] bg-brand-primary text-white">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 12 5 5 9-11" />
          </svg>
        </span>
      ) : (
        <span className="h-[17px] w-[17px] flex-shrink-0 rounded-[5px] border-[1.5px] border-ink-900/[.22]" />
      )}
      <span className={done ? "text-[13px] text-text-tertiary line-through" : "text-[13px] text-text-primary"}>
        {children}
      </span>
    </div>
  );
}

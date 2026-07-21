import { type ReactNode, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { DESIGNER_NAME } from "../dashboard.fixtures";
import { HeroGreeting } from "../components/HeroGreeting";
import { QuickActions } from "../components/QuickActions";
import { LatestRow } from "../components/LatestRow";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import { InspirationCard } from "@/features/inspiration/components/InspirationCard";
import { NoteCard } from "@/features/notes/components/NoteCard";
import { ResourceCard } from "@/features/resources/components/ResourceCard";
import { projectFixtures } from "@/features/projects/projects.fixtures";
import { boardFixtures } from "@/features/inspiration/inspiration.fixtures";
import { noteFixtures } from "@/features/notes/notes.fixtures";
import { resourceFixtures } from "@/features/resources/resources.fixtures";

const TABS = ["Latest", "Projects", "Inspiration", "Notes", "Resources"] as const;
type Tab = (typeof TABS)[number];

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
 * bespoke "Latest" cards or a masonry feed for the selected module.
 */
export function DashboardPage() {
  const [tab, setTab] = useState<Tab>("Latest");
  const [query, setQuery] = useState("");

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

        <QuickActions />
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

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-[13px] border border-white/55 px-[14px] py-2 text-[12.5px] text-text-secondary shadow-[inset_0_1px_0_rgba(255,255,255,.55)] backdrop-blur-[14px] transition-colors hover:text-text-primary"
          style={{ background: "rgba(255,255,255,.5)" }}
        >
          Recently updated
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      {/* Content */}
      {tab === "Latest" ? (
        <LatestRow />
      ) : (
        <div className="masonry3 mt-10">
          {tab === "Projects" &&
            projectFixtures.map((project) => (
              <MasonryItem key={project.id}>
                <ProjectCard project={project} variant="full" />
              </MasonryItem>
            ))}
          {tab === "Inspiration" &&
            boardFixtures.map((board) => (
              <MasonryItem key={board.id}>
                <InspirationCard board={board} variant="full" />
              </MasonryItem>
            ))}
          {tab === "Notes" &&
            noteFixtures.map((note) => (
              <MasonryItem key={note.id}>
                <NoteCard note={note} variant="full" />
              </MasonryItem>
            ))}
          {tab === "Resources" &&
            resourceFixtures.map((resource) => (
              <MasonryItem key={resource.id}>
                <ResourceCard resource={resource} variant="full" />
              </MasonryItem>
            ))}
        </div>
      )}
    </div>
  );
}

function MasonryItem({ children }: { children: ReactNode }) {
  return <div className="masonry-item">{children}</div>;
}

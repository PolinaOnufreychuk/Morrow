import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { GlassCard } from "@/components/shared/GlassCard";
import { StatusPill } from "@/components/shared/StatusPill";
import { Badge } from "@/components/ui/badge";
import { NoteTypeIcon } from "@/features/notes/components/NoteTypeIcon";
import { NOTE_TYPE_META } from "@/features/notes/noteTypeMeta";
import type { DashboardSummary } from "../types";

export interface LatestRowProps {
  summary: DashboardSummary;
}

/**
 * Four fixed-height compact cards — one each for the most recent Project,
 * Note, Inspiration board, and Resource. Fixed height keeps the row visually
 * even regardless of content (docs/FEATURES.md § Dashboard).
 */
export function LatestRow({ summary }: LatestRowProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="eyebrow text-text-tertiary">Latest</h2>
      <div className="grid grid-cols-1 gap-4 board:grid-cols-2 [@media(min-width:1400px)]:grid-cols-4">
        {summary.latestProject && (
          <LatestCard
            to={`/projects/${summary.latestProject.id}`}
            eyebrow="Project"
            title={summary.latestProject.title}
            imageUrl={summary.latestProject.coverImageUrl}
            footer={<StatusPill status={summary.latestProject.status} />}
          />
        )}
        {summary.latestNote && (
          <LatestCard
            to="/notes"
            eyebrow="Note"
            title={summary.latestNote.title}
            footer={
              <span className="flex items-center gap-1.5 text-[12px] text-text-tertiary">
                <NoteTypeIcon type={summary.latestNote.type} size={15} />
                {NOTE_TYPE_META[summary.latestNote.type].label}
              </span>
            }
          />
        )}
        {summary.latestBoard && (
          <LatestCard
            to={`/inspiration/${summary.latestBoard.id}`}
            eyebrow="Inspiration"
            title={summary.latestBoard.title}
            imageUrl={summary.latestBoard.coverImageUrl}
          />
        )}
        {summary.latestResource && (
          <LatestCard
            to="/resources"
            eyebrow="Resource"
            title={summary.latestResource.title}
            footer={
              summary.latestResource.tags[0] ? (
                <Badge variant="neutral">{summary.latestResource.tags[0]}</Badge>
              ) : undefined
            }
          />
        )}
      </div>
    </section>
  );
}

interface LatestCardProps {
  to: string;
  eyebrow: string;
  title: string;
  imageUrl?: string | null;
  footer?: ReactNode;
}

function LatestCard({ to, eyebrow, title, imageUrl, footer }: LatestCardProps) {
  return (
    <GlassCard interactive className="h-[168px] overflow-hidden">
      <Link to={to} className="flex h-full flex-col">
        {imageUrl && (
          <div className="m-2 h-20 overflow-hidden rounded-card-image">
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          </div>
        )}
        <div className="flex flex-1 flex-col justify-between gap-2 p-3 pt-2">
          <div className="flex flex-col gap-1">
            <span className="eyebrow text-text-tertiary">{eyebrow}</span>
            <span className="line-clamp-2 text-[14px] font-medium leading-snug text-text-primary">
              {title}
            </span>
          </div>
          {footer}
        </div>
      </Link>
    </GlassCard>
  );
}

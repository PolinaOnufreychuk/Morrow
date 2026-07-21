import { type CSSProperties, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import projectCover from "@/assets/petal-macro-1.png";
import inspirationCover from "@/assets/lotus-petals-1.png";

/**
 * The "Latest" row — exactly four bespoke 320px cards (Project, Note,
 * Inspiration, Resource) on one line, recreated from Dashboard.dc.html
 * (lines 136–205). Each is a condensed sibling of its full masonry card:
 * same materials, distinct internal identity, recognizable in < 1s without
 * reading the title. Content mirrors the hi-fi source.
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

  return (
    <div className="mt-10 grid grid-cols-1 items-start gap-4 board:grid-cols-2 [@media(min-width:1200px)]:grid-cols-4">
      {/* Project */}
      <PreviewShell onClick={() => navigate("/projects")} className="gap-2 p-4">
        <div className="flex items-center justify-between px-px">
          <TypeChip label="Project" bg="#FEFFFEE6" />
          <span className="text-[11.5px] text-text-tertiary">2d ago</span>
        </div>
        <div className="flex flex-col gap-1 px-px">
          <span className="text-[16px] font-medium leading-[1.3] text-text-primary">
            Fintech onboarding redesign
          </span>
          <span className="clamp1 text-[12.5px] leading-[1.5] text-text-secondary">
            Simplifying KYC and account setup.
          </span>
        </div>
        <div
          className="relative mt-1 flex-1 overflow-hidden rounded-[14px] bg-cover bg-center"
          style={{ backgroundImage: `url(${projectCover})` }}
        />
      </PreviewShell>

      {/* Note */}
      <PreviewShell
        onClick={() => navigate("/notes")}
        className="gap-[9px] px-[18px] py-4"
        style={{
          background: "linear-gradient(168deg,rgba(255,252,243,.78),rgba(255,255,255,.5))",
        }}
      >
        <div className="flex items-center justify-between">
          <TypeChip label="Note" bg="#FEFFFEE6" />
          <span className="text-[11.5px] text-text-tertiary">Today</span>
        </div>
        <span className="font-display text-[22px] font-light italic leading-[1.1] text-text-primary">
          Today&rsquo;s focus
        </span>
        <div className="border-b border-dashed border-ink-900/[.14]" />
        <div className="flex flex-col gap-[9px]">
          <ChecklistRow done>Finalize wireframes</ChecklistRow>
          <ChecklistRow done>Review design tokens</ChecklistRow>
          <ChecklistRow>Client walkthrough deck</ChecklistRow>
          <ChecklistRow>Collect references</ChecklistRow>
        </div>
        <span className="mt-auto text-[12px] text-text-tertiary">2 of 4 done</span>
      </PreviewShell>

      {/* Inspiration — fanned stack */}
      <PreviewShell onClick={() => navigate("/inspiration")} className="p-4">
        <div className="flex items-center justify-between">
          <TypeChip label="Inspiration" bg="#F3F6F0FA" />
          <span className="text-[11.5px] text-text-tertiary">24 items</span>
        </div>
        <div className="relative mb-[13px] mt-2 flex-1">
          <div className="absolute inset-x-[10px] bottom-1 top-[14px] rotate-[3.5deg] rounded-[14px] bg-white/80 shadow-[0_8px_20px_-12px_hsl(30_25%_20%_/_.25)]" />
          <div className="absolute inset-x-[5px] bottom-px top-2 -rotate-2 rounded-[14px] bg-white/95 shadow-[0_6px_16px_-10px_hsl(30_25%_20%_/_.2)]" />
          <div
            className="absolute inset-0 top-px rounded-[14px] bg-cover bg-center shadow-[0_10px_24px_-12px_hsl(30_25%_20%_/_.3)]"
            style={{ backgroundImage: `url(${inspirationCover})` }}
          />
        </div>
        <div className="flex flex-col gap-1.5 px-1.5 pb-1.5 pt-0.5">
          <span className="text-[16.5px] font-medium leading-[1.3] text-text-primary">
            Morning color studies
          </span>
          <span className="text-[12px] text-text-tertiary">Updated yesterday</span>
        </div>
      </PreviewShell>

      {/* Resource — GitHub repo preview */}
      <PreviewShell
        onClick={() => navigate("/resources")}
        className="gap-[11px] px-4 py-[14px]"
      >
        <div className="flex items-center justify-between">
          <TypeChip label="Resource" bg="#EEF1EA" />
          <span className="text-[11.5px] text-text-tertiary">Saved 3d ago</span>
        </div>
        <div className="flex flex-shrink-0 flex-col overflow-hidden rounded-[12px] border border-ink-900/[.07]">
          <div className="flex h-[22px] flex-shrink-0 items-center gap-1 border-b border-ink-900/[.05] bg-white/75 px-[10px]">
            <span className="h-[5px] w-[5px] rounded-full bg-ink-900/[.15]" />
            <span className="h-[5px] w-[5px] rounded-full bg-ink-900/[.15]" />
            <span className="h-[5px] w-[5px] rounded-full bg-ink-900/[.15]" />
          </div>
          <div className="flex h-24 items-center justify-center bg-[#0D1117] text-white">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.4 9.4 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[15.5px] font-medium leading-[1.3] text-text-primary">
            copilot-for-xcode
          </span>
          <span className="clamp1 text-[12.5px] leading-[1.5] text-text-secondary">
            AI coding assistant for Xcode.
          </span>
        </div>
        <div className="mt-auto flex items-center gap-[13px] text-[12px] text-text-tertiary">
          <span className="inline-flex items-center gap-[5px]">
            <span className="h-2 w-2 rounded-full bg-blush-600" />
            Swift
          </span>
          <span className="inline-flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
              <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z" />
            </svg>
            5.5k
          </span>
        </div>
      </PreviewShell>
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

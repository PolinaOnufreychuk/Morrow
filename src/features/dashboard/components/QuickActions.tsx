export interface QuickActionsProps {
  onNewProject?: () => void;
  onNewInspiration?: () => void;
  onNewNote?: () => void;
  onNewResource?: () => void;
}

const PLUS_ICON = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#6B8C6D"
    strokeWidth="1.8"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

/**
 * Four equal-weight glass "New …" buttons (Dashboard.dc.html lines 128–133).
 * No primary CTA on the dashboard — they share one visual weight. The sage
 * plus icon + forest text on a frosted-glass fill, hover tints sage and lifts.
 */
export function QuickActions({
  onNewProject,
  onNewInspiration,
  onNewNote,
  onNewResource,
}: QuickActionsProps) {
  const actions: { label: string; onClick?: () => void }[] = [
    { label: "Project", onClick: onNewProject },
    { label: "Inspiration", onClick: onNewInspiration },
    { label: "Note", onClick: onNewNote },
    { label: "Resource", onClick: onNewResource },
  ];

  return (
    <div className="mt-0.5 flex flex-wrap justify-center gap-3">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={action.onClick}
          className="inline-flex h-10 items-center gap-2 rounded-[12px] border border-white/55 px-[18px] text-[13px] font-medium leading-none tracking-[.01em] text-[#557057] shadow-[inset_0_1px_0_rgba(255,255,255,.6)] backdrop-blur-[12px] backdrop-saturate-[1.15] transition-[background,transform,box-shadow] duration-[220ms] ease-out hover:-translate-y-px hover:bg-sage-200/[.42] hover:shadow-[inset_0_1px_0_rgba(255,255,255,.6),0_8px_20px_-10px_hsl(30_25%_20%_/_.16)]"
          style={{ background: "rgba(255,255,255,.34)" }}
        >
          {PLUS_ICON}
          {action.label}
        </button>
      ))}
    </div>
  );
}

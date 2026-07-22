/** Small pill used on Dashboard preview cards/popups to label an entity's module ("Project", "Note", …). */
export function TypeChip({ label, bg }: { label: string; bg: string }) {
  return (
    <span
      className="inline-flex items-center rounded-chip px-[10px] py-[5px] text-[11px] font-medium leading-none tracking-[.01em] text-text-secondary"
      style={{ background: bg, border: "1px solid transparent" }}
    >
      {label}
    </span>
  );
}

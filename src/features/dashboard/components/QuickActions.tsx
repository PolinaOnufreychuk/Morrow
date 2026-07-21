import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/shared/GlassCard";
import { Icon } from "@/design-system/icons/Icon";

interface QuickAction {
  label: string;
  to: string;
}

const ACTIONS: QuickAction[] = [
  { label: "New project", to: "/projects" },
  { label: "New board", to: "/inspiration" },
  { label: "New note", to: "/notes" },
  { label: "New resource", to: "/resources" },
];

/** "Create New…" shortcuts (docs/FEATURES.md § Dashboard). */
export function QuickActions() {
  const navigate = useNavigate();
  return (
    <section className="flex flex-col gap-3">
      <h2 className="eyebrow text-text-tertiary">Quick actions</h2>
      <div className="grid grid-cols-2 gap-3 board:grid-cols-4">
        {ACTIONS.map((action) => (
          <GlassCard
            key={action.to}
            interactive
            onClick={() => navigate(action.to)}
            className="flex items-center gap-3 p-4"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-chip bg-sage-100 text-sage-700">
              <Icon name="plus" size={18} />
            </span>
            <span className="text-[14px] font-medium text-text-primary">{action.label}</span>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

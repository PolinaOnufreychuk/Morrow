import { Link } from "react-router-dom";
import { Icon } from "@/design-system/icons/Icon";

export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary"
    >
      <Icon name="arrow-left" size={16} />
      Back to {label}
    </Link>
  );
}

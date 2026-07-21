import { useDashboardSummary } from "../hooks/useDashboard";
import { DESIGNER_NAME } from "../dashboard.fixtures";
import { HeroGreeting } from "../components/HeroGreeting";
import { QuickActions } from "../components/QuickActions";
import { LatestRow } from "../components/LatestRow";

export function DashboardPage() {
  const { data: summary } = useDashboardSummary();

  return (
    <div className="flex flex-col gap-10">
      <HeroGreeting name={DESIGNER_NAME} />
      <QuickActions />
      {summary && <LatestRow summary={summary} />}
    </div>
  );
}

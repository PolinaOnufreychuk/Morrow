import { useQuery } from "@tanstack/react-query";
import { fetchDashboardSummary } from "../api/dashboardApi";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: fetchDashboardSummary,
  });
}

import type { DashboardSummary } from "../types";
import { dashboardSummaryFixture } from "../dashboard.fixtures";

/** Stubbed data access — no live supabase calls yet (scaffolding only). */
export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  // TODO: implement — most-recent row from each of the four modules
  return dashboardSummaryFixture;
}

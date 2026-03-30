import { DashboardControls, DashboardHeader, DashboardStats, TeamsGrid } from "@/features/dashboard/components/DashboardSections";
import { getWorkspaceSummary } from "@/features/teams/server/workspace.queries";

export default async function DashboardPage() {
  const teams = await getWorkspaceSummary()
  return (
    <div className="space-y-8">
      <DashboardHeader />
      <DashboardStats />
      <DashboardControls />
      <TeamsGrid teams={teams} />
    </div>
  );
}

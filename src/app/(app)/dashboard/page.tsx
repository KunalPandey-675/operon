import { DashboardControls, DashboardHeader, DashboardStats, TeamsGrid } from "@/components/dashboard/DashboardSections";
import { getTeams } from "@/lib/actions/workspace.actions";

export default async function DashboardPage() {
  const teams = await getTeams()
  return (
    <div className="space-y-8">
      <DashboardHeader />
      <DashboardStats />
      <DashboardControls />
      <TeamsGrid teams={teams} />
    </div>
  );
}

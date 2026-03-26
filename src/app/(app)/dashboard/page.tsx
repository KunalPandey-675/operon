import { DashboardControls, DashboardHeader, DashboardStats, TeamsGrid } from "@/components/dashboard/DashboardSections";
import { getWorkspace } from "@/lib/actions/workspace.actions";

export default async function DashboardPage() {
  const teams = await getWorkspace()
  return (
    <div className="space-y-8">
      <DashboardHeader />
      <DashboardStats />
      <DashboardControls />
      <TeamsGrid teams={teams} />
    </div>
  );
}

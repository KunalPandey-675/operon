"use client";

import { DashboardControls, DashboardHeader, DashboardStats, TeamsGrid } from "@/components/dashboard/DashboardSections";
import { MOCK_TEAMS } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader />
      <DashboardStats />
      <DashboardControls />
      <TeamsGrid teams={MOCK_TEAMS} />
    </div>
  );
}

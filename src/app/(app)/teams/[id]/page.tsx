import React from "react";
import { getWorkspaceById } from "@/features/teams/server/workspace.queries";
import TeamClient from "@/features/teams/components/TeamClient";


export default async function TeamDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workspace = await getWorkspaceById(id);

  return <TeamClient workspace={workspace} />;
}

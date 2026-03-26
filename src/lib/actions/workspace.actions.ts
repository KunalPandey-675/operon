"use server"

import { createSupabaseClient } from "../supabase"
import { getCurrentUserId } from "@/lib/current-user"

export async function getWorkspace() {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('teams')
    .select(`
      id,
      name,
      team_member ( id, user_id, role ),
      tasks ( id, title, status )
    `);

  if (error) {
    console.error("getWorkspace failed:", error.message)
    return []
  }

  return (data ?? []).map(t => ({
    id: t.id,
    name: t.name,
    memberCount: t.team_member?.length ?? 0,
    taskCount: t.tasks?.length ?? 0,
    members: t.team_member
  }));
}

function generateTeamCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function createWorkspace(formData: {
  name: string
  description?: string
  userId?: string
}) {
  try {
    // Use provided userId (from client), or fetch from Auth0 + Supabase
    let userId = formData.userId

    if (!userId) {
      userId = await getCurrentUserId()

      if (!userId) {
        return {
          success: false,
          error: "User not found in database"
        }
      }
    }

    const supabase = createSupabaseClient()
    const workspaceCode = generateTeamCode()

    const { data, error } = await supabase.from("teams")
      .insert({
        name: formData.name,
        description: formData.description || null,
        code: workspaceCode,
        created_by: userId,
      })
      .select()

    if (error) {
      console.error("createWorkspace failed:", error.message)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      data: data?.[0],
      message: "Team created successfully!"
    }
  } catch (error) {
    console.error("createWorkspace error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create team"
    }
  }
}
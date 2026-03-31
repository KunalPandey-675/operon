"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/lib/current-user";
import { createSupabaseServerClient } from "@/lib/supabase-server";

function generateTeamCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function addTeamMember(teamId: string, userId: string, role: "manager" | "member") {
  const supabase = await createSupabaseServerClient();

  return supabase.from("team_member").insert({
    team_id: teamId,
    user_id: userId,
    role,
  });
}

export async function createWorkspace(formData: {
  name: string;
  description?: string;
}) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "User not found in database",
      };
    }

    const supabase = await createSupabaseServerClient();
    const workspaceCode = generateTeamCode();

    const { data, error } = await supabase
      .from("teams")
      .insert({
        name: formData.name,
        description: formData.description || null,
        code: workspaceCode,
        created_by: userId,
      })
      .select();

    if (error) {
      console.error("createWorkspace failed:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    const createdTeam = data?.[0];
    if (!createdTeam?.id) {
      return {
        success: false,
        error: "Team created but id was not returned",
      };
    }

    const { error: membershipError } = await addTeamMember(createdTeam.id, userId, "manager");

    if (membershipError) {
      await supabase.from("teams").delete().eq("id", createdTeam.id);
      console.error("createWorkspace membership insert failed:", membershipError.message);
      return {
        success: false,
        error: membershipError.message,
      };
    }

    return {
      success: true,
      data: createdTeam,
      message: "Team created successfully!",
    };
  } catch (error) {
    console.error("createWorkspace error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create team",
    };
  }
}

export async function joinWorkspaceByCode(formData: {
  code: string;
}) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "User not found in database",
      };
    }

    const normalizedCode = formData.code.trim().toUpperCase();
    if (!normalizedCode) {
      return {
        success: false,
        error: "Team code is required",
      };
    }

    const supabase = await createSupabaseServerClient();

    const { data: team, error: teamLookupError } = await supabase
      .from("teams")
      .select("id, name")
      .eq("code", normalizedCode)
      .maybeSingle();

    if (teamLookupError) {
      console.error("joinWorkspaceByCode lookup failed:", teamLookupError.message);
      return {
        success: false,
        error: teamLookupError.message,
      };
    }

    if (!team?.id) {
      return {
        success: false,
        error: "Invalid team code",
      };
    }

    const { error: membershipError } = await addTeamMember(team.id, userId, "member");

    if (membershipError) {
      // Postgres unique violation means user is already in this team.
      if (membershipError.code === "23505") {
        return {
          success: true,
          data: team,
          message: "You are already a member of this team",
        };
      }

      console.error("joinWorkspaceByCode membership insert failed:", membershipError.message);
      return {
        success: false,
        error: membershipError.message,
      };
    }

    return {
      success: true,
      data: team,
      message: "Joined team successfully!",
    };
  } catch (error) {
    console.error("joinWorkspaceByCode error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to join team",
    };
  }
}

export async function renameWorkspace(formData: {
  teamId: string;
  name: string;
  description?: string | null;
}) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "User not found in database",
      };
    }

    const normalizedName = formData.name.trim();
    if (!normalizedName) {
      return {
        success: false,
        error: "Team name is required",
      };
    }

    const supabase = await createSupabaseServerClient();

    const { data: team, error: lookupError } = await supabase
      .from("teams")
      .select("id, created_by")
      .eq("id", formData.teamId)
      .maybeSingle();

    if (lookupError) {
      console.error("renameWorkspace lookup failed:", lookupError.message);
      return {
        success: false,
        error: lookupError.message,
      };
    }

    if (!team?.id) {
      return {
        success: false,
        error: "Team not found",
      };
    }

    if (team.created_by !== userId) {
      return {
        success: false,
        error: "Only the team owner can rename this team",
      };
    }

    const { error: updateError } = await supabase
      .from("teams")
      .update({
        name: normalizedName,
        description: formData.description?.trim() || null,
      })
      .eq("id", formData.teamId);

    if (updateError) {
      console.error("renameWorkspace update failed:", updateError.message);
      return {
        success: false,
        error: updateError.message,
      };
    }

    revalidatePath("/teams");
    revalidatePath(`/teams/${formData.teamId}`);
    revalidatePath(`/teams/${formData.teamId}/settings`);

    return {
      success: true,
      message: "Team renamed successfully",
    };
  } catch (error) {
    console.error("renameWorkspace error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to rename team",
    };
  }
}

export async function deleteWorkspace(formData: { teamId: string }) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "User not found in database",
      };
    }

    const supabase = await createSupabaseServerClient();

    const { data: team, error: lookupError } = await supabase
      .from("teams")
      .select("id, created_by")
      .eq("id", formData.teamId)
      .maybeSingle();

    if (lookupError) {
      console.error("deleteWorkspace lookup failed:", lookupError.message);
      return {
        success: false,
        error: lookupError.message,
      };
    }

    if (!team?.id) {
      return {
        success: false,
        error: "Team not found",
      };
    }

    if (team.created_by !== userId) {
      return {
        success: false,
        error: "Only the team owner can delete this team",
      };
    }

    const { data: taskRows, error: tasksLookupError } = await supabase
      .from("tasks")
      .select("id")
      .eq("team_id", formData.teamId);

    if (tasksLookupError) {
      console.error("deleteWorkspace tasks lookup failed:", tasksLookupError.message);
      return {
        success: false,
        error: tasksLookupError.message,
      };
    }

    const taskIds = (taskRows ?? []).map((task) => task.id);

    if (taskIds.length > 0) {
      const { error: assignmentsDeleteError } = await supabase
        .from("task_assignments")
        .delete()
        .in("task_id", taskIds);

      if (assignmentsDeleteError) {
        console.error("deleteWorkspace assignments delete failed:", assignmentsDeleteError.message);
        return {
          success: false,
          error: assignmentsDeleteError.message,
        };
      }

      const { error: tasksDeleteError } = await supabase
        .from("tasks")
        .delete()
        .eq("team_id", formData.teamId);

      if (tasksDeleteError) {
        console.error("deleteWorkspace tasks delete failed:", tasksDeleteError.message);
        return {
          success: false,
          error: tasksDeleteError.message,
        };
      }
    }

    const { error: membersDeleteError } = await supabase
      .from("team_member")
      .delete()
      .eq("team_id", formData.teamId);

    if (membersDeleteError) {
      console.error("deleteWorkspace members delete failed:", membersDeleteError.message);
      return {
        success: false,
        error: membersDeleteError.message,
      };
    }

    const { error: teamDeleteError } = await supabase
      .from("teams")
      .delete()
      .eq("id", formData.teamId);

    if (teamDeleteError) {
      console.error("deleteWorkspace team delete failed:", teamDeleteError.message);
      return {
        success: false,
        error: teamDeleteError.message,
      };
    }

    revalidatePath("/teams");
    revalidatePath("/tasks");

    return {
      success: true,
      message: "Team deleted successfully",
    };
  } catch (error) {
    console.error("deleteWorkspace error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete team",
    };
  }
}

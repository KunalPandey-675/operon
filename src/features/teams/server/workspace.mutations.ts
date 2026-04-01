"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/lib/current-user";
import { createSupabaseServerClient } from "@/lib/supabase-server";

function generateTeamCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function createWorkspace(formData: {
  name: string;
  description?: string;
}) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return {
      success: false,
      error: "User not found in database",
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user: authUser },
    error: authUserError,
  } = await supabase.auth.getUser();

  if (authUserError || !authUser?.id) {
    console.error("createWorkspace auth lookup failed:", authUserError?.message);
    return {
      success: false,
      error: "Could not verify authenticated user",
    };
  }

  if (userId !== authUser.id) {
    console.error("createWorkspace user mismatch:", {
      dbUserId: userId,
      authUserId: authUser.id,
    });
    return {
      success: false,
      error: "User identity mismatch: please sign out and sign in again",
    };
  }

  const workspaceCode = generateTeamCode();
  const teamId = crypto.randomUUID();

  const { error } = await supabase
    .from("teams")
    .insert({
      id: teamId,
      name: formData.name,
      description: formData.description || null,
      code: workspaceCode,
      created_by: userId,
    })
    ;

  if (error) {
    console.error("createWorkspace failed:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      dbUserId: userId,
      authUserId: authUser.id,
    });
    return {
      success: false,
      error: error.code
        ? `${error.message} (code: ${error.code})`
        : error.message,
    };
  }

  const { error: membershipError } = await supabase.from("team_member").insert({
    team_id: teamId,
    user_id: userId,
    role: "manager",
  });

  if (membershipError) {
    await supabase.from("teams").delete().eq("id", teamId);
    console.error("createWorkspace membership insert failed:", membershipError.message);
    return {
      success: false,
      error: membershipError.message,
    };
  }

  const createdTeam = {
    id: teamId,
    name: formData.name,
    description: formData.description || null,
    code: workspaceCode,
    created_by: userId,
  };

  return {
    success: true,
    data: createdTeam,
    message: "Team created successfully!",
  };
}

export async function joinWorkspaceByCode(formData: {
  code: string;
}) {
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
  const { data: joinResult, error: joinError } = await supabase.rpc("join_team_by_code", {
    p_code: normalizedCode,
  });

  if (joinError) {
    console.error("joinWorkspaceByCode rpc failed:", joinError.message);
    return {
      success: false,
      error:
        joinError.code === "PGRST202"
          ? "Team join is not configured. Please ask an admin to create join_team_by_code RPC."
          : joinError.message,
    };
  }

  const row = Array.isArray(joinResult) ? joinResult[0] : joinResult;
  if (!row || !row.team_id) {
    return {
      success: false,
      error: "Invalid team code",
    };
  }

  const team = {
    id: row.team_id as string,
    name: (row.team_name as string) ?? "",
  };

  if (row.status === "already_member") {
    return {
      success: true,
      data: team,
      message: "You are already a member of this team",
    };
  }

  return {
    success: true,
    data: team,
    message: "Joined team successfully!",
  };
}

export async function renameWorkspace(formData: {
  teamId: string;
  name: string;
  description?: string | null;
}) {
  const normalizedName = formData.name.trim();
  if (!normalizedName) {
    return {
      success: false,
      error: "Team name is required",
    };
  }

  const supabase = await createSupabaseServerClient();

  const { data: updatedTeam, error: updateError } = await supabase
    .from("teams")
    .update({
      name: normalizedName,
      description: formData.description?.trim() || null,
    })
    .eq("id", formData.teamId)
    .select("id")
    .maybeSingle();

  if (updateError) {
    console.error("renameWorkspace update failed:", updateError.message);
    return {
      success: false,
      error: updateError.message,
    };
  }

  if (!updatedTeam) {
    return {
      success: false,
      error: "Team not found or not allowed",
    };
  }

  revalidatePath("/teams");
  revalidatePath(`/teams/${formData.teamId}`);
  revalidatePath(`/teams/${formData.teamId}/settings`);

  return {
    success: true,
    message: "Team renamed successfully",
  };
}

export async function deleteWorkspace(formData: { teamId: string }) {
  const supabase = await createSupabaseServerClient();
  const { data: deletedTeam, error: teamDeleteError } = await supabase
    .from("teams")
    .delete()
    .eq("id", formData.teamId)
    .select("id")
    .maybeSingle();

  if (teamDeleteError) {
    console.error("deleteWorkspace team delete failed:", teamDeleteError.message);
    return {
      success: false,
      error: teamDeleteError.message,
    };
  }

  if (!deletedTeam) {
    return {
      success: false,
      error: "Team not found or not allowed",
    };
  }

  revalidatePath("/teams");
  revalidatePath("/tasks");

  return {
    success: true,
    message: "Team deleted successfully",
  };
}

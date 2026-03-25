"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth0 } from "@/lib/auth0";
import { updateUserNameByAuth0Id } from "@/lib/actions/member.actions";

const UsernameSchema = z
  .string()
  .trim()
  .min(2, "Username must be at least 2 characters")
  .max(30, "Username must be 30 characters or less")
  .regex(/^[a-zA-Z0-9_]+$/, "Use only letters, numbers, and underscores");

export type UsernameActionState = {
  error?: string;
  success?: boolean;
};

export async function saveUsernameAction(
  _prevState: UsernameActionState,
  formData: FormData
): Promise<UsernameActionState> {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    redirect("/auth/login");
  }

  if (!user.email_verified) {
    redirect("/verify-email");
  }

  const parsed = UsernameSchema.safeParse(formData.get("username"));

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid username",
      success: false,
    };
  }

  const result = await updateUserNameByAuth0Id(user.sub, parsed.data);

  if (!result.success) {
    return {
      error: "Could not save username. Please try again.",
      success: false,
    };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

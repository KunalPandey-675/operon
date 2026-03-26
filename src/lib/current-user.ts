import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { createUserIfNotExists } from "@/features/members/server/member.mutations";
import { fetchUserById } from "@/features/members/server/member.queries";

export const getCurrentAuth0User = cache(async () => {
  const session = await auth0.getSession();
  return session?.user ?? null;
});

export const getCurrentDbUser = cache(async () => {
  const auth0User = await getCurrentAuth0User();

  if (!auth0User || !auth0User.email_verified) {
    return null;
  }

  await createUserIfNotExists(auth0User);
  return fetchUserById(auth0User.sub);
});

export const getCurrentUserId = cache(async () => {
  const dbUser = await getCurrentDbUser();
  return dbUser?.id ?? null;
});

export async function requireCurrentAuth0User() {
  const auth0User = await getCurrentAuth0User();

  if (!auth0User) {
    redirect("/auth/login");
  }

  if (!auth0User.email_verified) {
    redirect("/verify-email");
  }

  return auth0User;
}

export async function requireCurrentDbUser() {
  await requireCurrentAuth0User();

  const dbUser = await getCurrentDbUser();

  if (!dbUser?.id) {
    throw new Error("User not found in database");
  }

  return dbUser;
}
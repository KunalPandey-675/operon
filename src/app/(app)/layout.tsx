import React from "react";
import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { createUserIfNotExists, fetchUserById } from "@/lib/actions/member.actions";
import AppShell from "@/components/AppShell";

export default async function ProtectedAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    redirect("/auth/login");
  }

  if (!user.email_verified) {
    redirect("/verify-email");
  }

  await createUserIfNotExists(user);
  const dbUser = await fetchUserById(user.sub)

  return <AppShell user={dbUser}>{children}</AppShell>;
}

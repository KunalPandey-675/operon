import React from "react";
import { requireCurrentDbUser } from "@/lib/current-user";
import AppShell from "@/components/AppShell";
import { CurrentUserProvider } from "@/components/providers/CurrentUserProvider";

export default async function ProtectedAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dbUser = await requireCurrentDbUser();

  return (
    <CurrentUserProvider userId={dbUser.id ?? null}>
      <AppShell user={dbUser}>{children}</AppShell>
    </CurrentUserProvider>
  );
}

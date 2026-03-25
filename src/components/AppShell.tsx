"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import UsernameModal from "@/components/onboarding/UsernameModal";

export default function AppShell({ children, user }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <UsernameModal isOpen={!user?.name?.trim()} />
      <Navbar user={user} />
      <div className="flex flex-1">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="flex-1 min-h-[calc(100vh-4rem)] bg-gray-50/50 p-4 transition-all duration-300 md:p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

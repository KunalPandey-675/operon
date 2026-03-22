"use client";

import React, { useState } from "react";
import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { cn } from "@/lib/utils";

function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main 
          className={cn(
            "flex-1 transition-all duration-300 min-h-[calc(100vh-4rem)] bg-gray-50/50 p-4 md:p-6 lg:p-10",
            collapsed ? "lg:ml-0" : "lg:ml-0" // Sidebar is fixed width or margin? 
            // Actually Sidebar is NOT fixed position in my implementation, it's just flex.
          )}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export { AppLayout };
export default AppLayout;

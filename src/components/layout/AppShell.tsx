"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import UsernameModal from "@/components/onboarding/UsernameModal";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  user?: any;
}

export default function AppShell({ children, user }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      <UsernameModal isOpen={!user?.name?.trim()} />
      
      {/* Fixed Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content Area */}
      <div 
        className={cn(
          "flex flex-col flex-1 min-w-0 transition-all duration-300",
          collapsed ? "lg:ml-[70px]" : "lg:ml-64"
        )}
      >
        <Navbar user={user} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50/30 dark:bg-zinc-950/30">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="p-4 md:p-6 lg:p-8"
          >
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}


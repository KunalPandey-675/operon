"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  CheckSquare, 
  ChevronLeft, 
  Menu, 
  Settings, 
  Users, 
  Zap,
  LayoutDashboard,
  Bell,
  Search,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Users, label: "Teams", href: "/teams" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
];

export function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (val: boolean) => void }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r bg-card fixed top-0 left-0 z-40 transition-all duration-300 ease-in-out h-screen",
        collapsed ? "w-[70px]" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className={cn(
        "flex h-16 items-center border-b px-4 transition-all duration-300",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
          </div>
          {!collapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-bold text-xl tracking-tight"
            >
              Operon
            </motion.span>
          )}
        </Link>
        {!collapsed && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setCollapsed(true)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {collapsed && (
        <div className="flex justify-center py-2 border-b">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setCollapsed(false)}
          >
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </Button>
        </div>
      )}

      {/* Main Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
              Main Menu
            </p>
          )}
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full transition-all duration-200 group relative",
                    collapsed ? "justify-center px-0 h-10 w-10 mx-auto" : "justify-start px-3 h-10",
                    isActive 
                      ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className={cn(
                    "h-[18px] w-[18px] transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                    !collapsed && "mr-3"
                  )} />
                  {!collapsed && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}
                  {isActive && !collapsed && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                    />
                  )}
                </Button>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 space-y-1">
          {!collapsed && (
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Direct Actions
              </p>
              <Button variant="ghost" size="icon" className="h-4 w-4 text-muted-foreground">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          )}
          <Button
            variant="ghost"
            className={cn(
              "w-full group",
              collapsed ? "justify-center px-0 h-10 w-10 mx-auto" : "justify-start px-3 h-10 text-muted-foreground"
            )}
          >
            <Search className={cn("h-[18px] w-[18px]", !collapsed && "mr-3")} />
            {!collapsed && <span className="text-sm">Search</span>}
          </Button>
        </div>
      </ScrollArea>

      {/* Bottom Section (Settings separated) */}
      <div className="mt-auto border-t p-3 space-y-1">
        <Link href="/settings">
          <Button
            variant="ghost"
            className={cn(
              "w-full transition-all duration-200 group relative",
              collapsed ? "justify-center px-0 h-10 w-10 mx-auto" : "justify-start px-3 h-10",
              pathname.startsWith("/settings") 
                ? "bg-primary/10 text-primary hover:bg-primary/15" 
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <Settings className={cn(
              "h-[18px] w-[18px] transition-colors",
              pathname.startsWith("/settings") ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
              !collapsed && "mr-3"
            )} />
            {!collapsed && <span className="font-medium text-sm">Settings</span>}
          </Button>
        </Link>
      </div>
    </aside>
  );
}

export function MobileSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden mr-2">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 border-r bg-card">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">Operon</span>
          </div>
          <ScrollArea className="flex-1 px-3 py-6">
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">
                Main Menu
              </p>
              {menuItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start px-3 h-11 mb-1 transition-all duration-200",
                        isActive 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <item.icon className={cn("h-[18px] w-[18px] mr-3", isActive ? "text-primary" : "text-muted-foreground")} />
                      <span className="font-medium">{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </ScrollArea>
          <div className="p-4 border-t mt-auto">
            <Link href="/settings">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start px-3 h-11 transition-all duration-200",
                  pathname.startsWith("/settings") ? "bg-primary/10 text-primary" : "text-muted-foreground"
                )}
              >
                <Settings className="h-[18px] w-[18px] mr-3" />
                <span className="font-medium">Settings</span>
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}


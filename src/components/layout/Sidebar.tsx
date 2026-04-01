"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CheckSquare, ChevronLeft, Menu, Settings, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const menuItems = [
  { icon: Users, label: "Teams", href: "/teams" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (val: boolean) => void }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r bg-sidebar sticky top-16 h-[calc(100vh-4rem)] z-40 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start transition-all duration-200",
                  collapsed ? "px-2" : "px-4"
                )}
              >
                <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="p-3 border-t">
        <Button
          variant="ghost"
          size="icon"
          className="w-full flex justify-center"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft className={cn("h-5 w-5 transition-transform duration-300", collapsed && "rotate-180")} />
        </Button>
      </div>
    </aside>
  );
}

export function MobileSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close sheet when path changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden mr-2">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] sm:w-87.5 p-0">
        <div className="flex flex-col h-full bg-sidebar">
          <div className="p-6 border-b flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Operon</span>
          </div>
          <ScrollArea className="flex-1 px-3 py-6">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
                    className="w-full justify-start px-4 h-12 text-lg"
                  >
                    <item.icon className="h-6 w-6 mr-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </ScrollArea>
          <div className="p-6 border-t mt-auto">
             <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-full bg-gray-200" />
               <div className="flex flex-col">
                 <span className="text-sm font-medium">Alex Johnson</span>
                 <span className="text-xs text-muted-foreground">alex@example.com</span>
               </div>
             </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import React from "react";
import {
  Search,
  Plus,
  HelpCircle,
  ChevronDown,
  LogOut,
  User,
  Settings
} from "lucide-react";
import { MobileSidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { NotificationBell } from "@/components/layout/NotificationBell";

export function Navbar({ user }: { user: any }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md lg:px-6">
      <MobileSidebar />
      
      <div className="flex flex-1 items-center gap-4 md:gap-8">
        <div className="relative hidden max-w-sm flex-1 md:flex">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects, tasks..."
            className="w-full rounded-lg bg-secondary/50 pl-9 border-none focus-visible:ring-1 focus-visible:ring-primary/20 h-9 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground hidden sm:flex">
          <HelpCircle className="h-5 w-5" />
        </Button>
        
        <NotificationBell />

        <div className="h-6 w-px bg-border mx-2 hidden sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative flex items-center gap-2 px-2 h-10 rounded-full hover:bg-secondary/50 transition-all">
              <Avatar className="h-8 w-8 border border-primary/20">
                <AvatarImage src={user?.avatar_url || "https://github.com/shadcn.png"} alt="User" />
                <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                  {user?.name?.substring(0, 2).toUpperCase() || "OP"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mt-2 shadow-xl border-primary/10" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || "Unnamed user"}</p>
                <p className="text-xs leading-none text-muted-foreground truncate max-w-[180px]">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer py-2">
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer py-2">
              <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer py-2">
              <Plus className="mr-2 h-4 w-4 text-muted-foreground" />
              New Project
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer py-2 text-destructive focus:text-destructive">
              <a href="/auth/logout" className="flex items-center w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}


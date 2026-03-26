"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Filter, FolderOpen, Layout, Plus, Search, Users, type LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type DashboardMember = {
  id?: string;
  user_id?: string | null;
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
};

type DashboardTeam = {
  id: string;
  name: string;
  description?: string | null;
  members?: DashboardMember[];
  taskCount?: number | null;
};

type StatCardData = {
  label: string;
  value: string;
  trend: string;
  accentClass: string;
  accentBackgroundClass: string;
  iconClass: string;
  trendClass: string;
  icon: LucideIcon;
};

const STAT_CARDS: StatCardData[] = [
  {
    label: "Active Projects",
    value: "12",
    trend: "+2 from last month",
    accentClass: "border-l-blue-600 shadow-blue-50/50 hover:shadow-blue-100",
    accentBackgroundClass: "bg-blue-50",
    iconClass: "text-blue-600",
    trendClass: "text-green-600",
    icon: Layout,
  },
  {
    label: "Team Members",
    value: "48",
    trend: "+5 new joins",
    accentClass: "border-l-indigo-600 shadow-indigo-50/50 hover:shadow-indigo-100",
    accentBackgroundClass: "bg-indigo-50",
    iconClass: "text-indigo-600",
    trendClass: "text-green-600",
    icon: Users,
  },
  {
    label: "Completed Tasks",
    value: "1,204",
    trend: "98% success rate",
    accentClass: "border-l-emerald-600 shadow-emerald-50/50 hover:shadow-emerald-100",
    accentBackgroundClass: "bg-emerald-50",
    iconClass: "text-emerald-600",
    trendClass: "text-gray-500",
    icon: CheckCircle2,
  },
];

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 justify-between md:flex-row md:items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Workspace Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Select a team to view progress or manage workflows.</p>
      </div>
      <Link href="/teams/create">
        <Button className="h-11 bg-blue-600 px-6 shadow-md transition-all hover:scale-105 hover:bg-blue-700 active:scale-95">
          <Plus className="mr-2 h-5 w-5" />
          Create Team
        </Button>
      </Link>
    </div>
  );
}

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {STAT_CARDS.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.label}
            className={`border-none border-l-4 bg-white shadow-xl transition-all ${stat.accentClass}`}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                  <h3 className="mt-2 text-3xl font-bold">{stat.value}</h3>
                </div>
                <div className={`rounded-lg p-2 ${stat.accentBackgroundClass}`}>
                  <Icon className={`h-6 w-6 ${stat.iconClass}`} />
                </div>
              </div>
              <p className={`mt-4 text-xs font-medium ${stat.trendClass}`}>{stat.trend}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function DashboardControls() {
  return (
    <div className="flex flex-col items-center gap-4 py-2 md:flex-row">
      <div className="relative w-full max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Filter teams..." className="h-11 border-gray-200 bg-white pl-9" />
      </div>
      <div className="flex w-full gap-2 md:w-auto">
        <Button variant="outline" className="h-11 border-gray-200 bg-white px-4">
          <Filter className="mr-2 h-4 w-4" />
          Sort
        </Button>
        <Button variant="outline" className="h-11 border-gray-200 bg-white px-4">
          <Layout className="mr-2 h-4 w-4" />
          Grid
        </Button>
      </div>
    </div>
  );
}

export function TeamsGrid({ teams }: { teams: DashboardTeam[] }) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
      {teams.map((team, idx) => (
        <motion.div
          key={team.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
        >
          <Link href={`/teams/${team.id}`}>
            <Card className="group h-full border-none bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-blue-100 hover:ring-2 hover:ring-blue-600/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold leading-none tracking-tight transition-colors group-hover:text-blue-600">
                  {team.name}
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="border-none bg-blue-50 text-[10px] font-bold uppercase tracking-widest text-blue-700 hover:bg-blue-100"
                >
                  Active
                </Badge>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="h-10 line-clamp-2 text-sm leading-relaxed text-gray-500">{team.description ?? "No description available."}</p>
                <div className="mt-8 flex items-center justify-between border-t pt-6">
                  <div className="flex -space-x-3 overflow-hidden">
                    {(team.members ?? []).map((member, i) => {
                      const memberLabel = member.name?.trim() || member.email?.split("@")[0] || member.user_id || "U";

                      return (
                        <Avatar key={member.id ?? `${team.id}-member-${i}`} className="inline-block h-9 w-9 border-2 border-white ring-2 ring-gray-100">
                          <AvatarImage src={member.avatar ?? undefined} />
                          <AvatarFallback>{memberLabel.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                    <div className="flex items-center gap-1.5 rounded-lg border bg-gray-50 px-2.5 py-1.5">
                      <FolderOpen className="h-3.5 w-3.5" />
                      {team.taskCount ?? 0} Tasks
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center rounded-b-xl border-t bg-gray-50/50 px-6 py-4">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 transition-colors group-hover:text-blue-600">
                  View Workspace
                  <ArrowRight className="h-3.5 w-3.5 transform transition-transform group-hover:translate-x-1" />
                </span>
              </CardFooter>
            </Card>
          </Link>
        </motion.div>
      ))}

      <Link href="/teams/create" className="h-full">
        <Card className="group flex h-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/10 p-8 shadow-none transition-all hover:border-blue-200 hover:bg-blue-50">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600/5 ring-2 ring-blue-600/10 transition-all group-hover:scale-110 group-hover:bg-blue-600/10">
            <Plus className="h-7 w-7 text-blue-600" />
          </div>
          <p className="mb-2 text-lg font-bold text-gray-900">Create New Team</p>
          <p className="text-center text-sm text-gray-500">Add another team to your unified workspace</p>
        </Card>
      </Link>
    </div>
  );
}

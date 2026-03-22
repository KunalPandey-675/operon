"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Settings,
  Users,
  Layout,
  Calendar,
  Filter,
  Search,
  MoreVertical,
  ChevronDown
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { MOCK_TEAMS, MOCK_TASKS, Team, Task } from "@/lib/mock-data";
import { TaskCard } from "@/components/TaskCard";
import { AvatarGroup } from "@/components/AvatarGroup";
import { Badge } from "@/components/ui/badge";

export default function TeamDetailsPage({ params }: { params: { id: string } }) {
  const team = MOCK_TEAMS.find(t => t.id === params.id) || MOCK_TEAMS[0];
  const teamTasks = MOCK_TASKS.filter(t => t.teamId === team.id);

  const [filter, setFilter] = useState("All");

  const filteredTasks = filter === "All"
    ? teamTasks
    : teamTasks.filter(t => t.status === filter);

  return (
    <div className="space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9 px-3 border-gray-200">
              <Settings className="mr-2 h-4 w-4" /> Team Config
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Team Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-100">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{team.name}</h1>
            </div>
            <p className="text-lg text-gray-500 leading-relaxed font-normal">{team.description}</p>

            <div className="flex items-center gap-6 pt-2">
              <AvatarGroup users={team.members} max={4} />
              <div className="h-4 w-px bg-gray-200" />
              <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
                <Layout className="h-4 w-4 text-blue-500" />
                {team.taskCount} Active Tasks
              </div>
            </div>
          </div>

          <Link href="/tasks/create">
            <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 font-bold transition-all hover:scale-105 active:scale-95">
              <Plus className="mr-2 h-5 w-5" /> Create Task
            </Button>
          </Link>
        </div>

        {/* Tabs and Filtering */}
        <Tabs defaultValue="All" className="w-full" onValueChange={setFilter}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-2">
            <TabsList className="bg-gray-100/50 p-1 rounded-xl h-11 self-start md:self-auto border border-gray-100">
              <TabsTrigger value="All" className="rounded-lg px-6 h-9 font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">All</TabsTrigger>
              <TabsTrigger value="Completed" className="rounded-lg px-6 h-9 font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm">Completed</TabsTrigger>
              <TabsTrigger value="Pending" className="rounded-lg px-6 h-9 font-bold data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm">Pending</TabsTrigger>
              <TabsTrigger value="Deadline Passed" className="rounded-lg px-6 h-9 font-bold data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-sm">Deadlines</TabsTrigger>
            </TabsList>

            <div className="flex w-full md:w-auto items-center gap-3">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search tasks..." className="pl-9 h-11 bg-white border-gray-100 rounded-xl" />
              </div>
              <Button variant="outline" className="h-11 px-4 border-gray-100 bg-white rounded-xl font-bold uppercase text-[10px] tracking-widest">
                <Filter className="mr-2 h-4 w-4 text-blue-500" /> Sort
              </Button>
            </div>
          </div>

          <TabsContent value={filter} className="mt-8">
            {filteredTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTasks.map((task, idx) => (
                  <TaskCard key={task.id} task={task} idx={idx} />
                ))}
              </div>
            ) : (
              <div className="py-24 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-3xl border border-gray-100 border-dashed">
                <div className="h-16 w-16 rounded-full bg-blue-100/50 flex items-center justify-center mb-6">
                  <Layout className="h-8 w-8 text-blue-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-500 max-w-sm font-normal">
                  Try adjusting your filters or create a new task for this team workspace.
                </p>
                <Link href="/tasks/create" className="mt-8">
                  <Button variant="outline" className="h-11 px-6 border-blue-200 text-blue-600 hover:bg-blue-50 font-bold uppercase text-[10px] tracking-widest">
                    Create First Task
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
  );
}

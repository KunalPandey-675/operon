"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Calendar, Filter, Plus, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/features/tasks/components/StatusBadge";
import { MOCK_TASKS, MOCK_TEAMS, TaskStatus } from "@/lib/mock-data";

const statusOptions: Array<"All" | TaskStatus> = ["All", "Pending", "Completed", "Deadline Passed"];

export default function TasksPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>("All");
  const [teamFilter, setTeamFilter] = useState("All");

  const filteredTasks = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return MOCK_TASKS.filter((task) => {
      const team = MOCK_TEAMS.find((item) => item.id === task.teamId);
      const matchesQuery =
        normalized.length === 0 ||
        task.title.toLowerCase().includes(normalized) ||
        task.description.toLowerCase().includes(normalized) ||
        task.assignee.name.toLowerCase().includes(normalized) ||
        (team?.name.toLowerCase().includes(normalized) ?? false);
      const matchesStatus = statusFilter === "All" || task.status === statusFilter;
      const matchesTeam = teamFilter === "All" || task.teamId === teamFilter;

      return matchesQuery && matchesStatus && matchesTeam;
    });
  }, [query, statusFilter, teamFilter]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between pb-6 border-b">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Tasks</h1>
          <p className="text-gray-500">Track work across teams with fast filtering and search.</p>
        </div>
        <Link href="/tasks/create">
          <Button className="h-11 px-6 bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-100">
            <Plus className="mr-2 h-4 w-4" /> Create Task
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_220px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, description, assignee, or team..."
            className="h-11 pl-9"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as (typeof statusOptions)[number])}
          className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option === "All" ? "All statuses" : option}
            </option>
          ))}
        </select>

        <select
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="All">All teams</option>
          {MOCK_TEAMS.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="hidden items-center border-b bg-gray-50/70 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 md:grid md:grid-cols-[2fr_1fr_1fr_1fr_auto]">
          <span>Task</span>
          <span>Team</span>
          <span>Status</span>
          <span>Assignee</span>
          <span className="text-right">Due / Action</span>
        </div>

        {filteredTasks.length > 0 ? (
          <div>
            {filteredTasks.map((task) => {
              const team = MOCK_TEAMS.find((item) => item.id === task.teamId);

              return (
                <div
                  key={task.id}
                  className="grid gap-4 border-b px-6 py-4 md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:items-center last:border-b-0"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">{task.description}</p>
                  </div>

                  <p className="text-sm font-medium text-gray-600">{team?.name ?? "Unknown team"}</p>

                  <div>
                    <StatusBadge status={task.status} />
                  </div>

                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7 border border-gray-100">
                      <AvatarImage src={task.assignee.avatar} />
                      <AvatarFallback>{task.assignee.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-700">{task.assignee.name}</span>
                  </div>

                  <div className="flex items-center justify-between gap-3 md:justify-end">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      {task.dueDate}
                    </span>
                    <Link href={`/tasks/${task.id}`}>
                      <Button variant="ghost" size="sm" className="font-semibold text-blue-600 hover:text-blue-700">
                        Open <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
              <Filter className="h-5 w-5 text-blue-600" />
            </div>
            <p className="font-semibold text-gray-700">No tasks matched your filters.</p>
            <p className="text-sm text-gray-500 mt-1">Adjust filters or clear the search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
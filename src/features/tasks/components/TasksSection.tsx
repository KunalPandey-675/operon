"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { 
  ArrowRight, 
  Calendar, 
  Filter, 
  Plus, 
  Search, 
  LayoutList,
  LayoutGrid,
  SearchX,
  Target,
  Users,
  ChevronRight,
  MoreVertical,
  Activity,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/features/tasks/components/StatusBadge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const statusOptions = ["All", "todo", "in_progress", "done"] as const;

const statusLabels: Record<(typeof statusOptions)[number], string> = {
    All: "All statuses",
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done",
};

const dbToBadgeStatus: Record<Exclude<(typeof statusOptions)[number], "All">, TaskStatus> = {
    todo: "Pending",
    in_progress: "Pending",
    done: "Completed",
};

function formatDeadline(deadline: string | null) {
    if (!deadline) return "No due date";
    const date = new Date(deadline);

    if (Number.isNaN(date.getTime())) return "No due date";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}


export default function TaskSection({ tasks, teams }: { tasks: DbTask[]; teams: DbTeamWithRelations[] }) {
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>("All");
    const [teamFilter, setTeamFilter] = useState("All");

    const filteredTasks = useMemo(() => {
        const normalized = query.trim().toLowerCase();

        return tasks.filter((task) => {
            const team = teams.find((item) => item.id === task.team_id);
            const creatorName = task.created_by_name ?? "";
            const matchesQuery =
                normalized.length === 0 ||
                task.title.toLowerCase().includes(normalized) ||
                (task.description?.toLowerCase().includes(normalized) ?? false) ||
                creatorName.toLowerCase().includes(normalized) ||
                (team?.name.toLowerCase().includes(normalized) ?? false);
            const matchesStatus = statusFilter === "All" || task.status === statusFilter;
            const matchesTeam = teamFilter === "All" || task.team_id === teamFilter;

            return matchesQuery && matchesStatus && matchesTeam;
        });
    }, [query, statusFilter, teamFilter, tasks, teams]);

    return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      <h1 className="text-4xl font-black tracking-tight text-foreground">Tasks</h1>
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">Keep your workspace organized and track progress across all team projects.</p>
                </div>
                <div className="flex items-center gap-3">
                  <Link href="/tasks/create">
                      <Button variant="premium" className="h-11 px-6 rounded-xl font-bold group">
                          <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" /> 
                          Create Task
                      </Button>
                  </Link>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 bg-card/30 p-2 rounded-2xl border border-border/40 transition-all duration-300">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for tasks..."
                        className="w-full pl-10 h-11 bg-transparent border-none focus-visible:ring-0 text-sm placeholder:text-muted-foreground/60 shadow-none"
                    />
                </div>
                
                <Separator orientation="vertical" className="h-6 hidden md:block" />

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Select
                        value={statusFilter}
                        onValueChange={(val: string) => setStatusFilter(val as (typeof statusOptions)[number])}
                    >
                        <SelectTrigger className="w-full md:w-[150px] h-11 bg-transparent border-none focus:ring-0 px-4 group">
                          <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors overflow-hidden">
                            <Activity className="h-4 w-4" />
                            <div className="flex-1 text-left truncate">
                              <SelectValue placeholder="Status" />
                            </div>
                          </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-primary/10 shadow-xl">
                            {statusOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {statusLabels[option]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Separator orientation="vertical" className="h-6 hidden md:block" />

                    <Select
                        value={teamFilter}
                        onValueChange={setTeamFilter}
                    >
                        <SelectTrigger className="w-full md:w-[180px] h-11 bg-transparent border-none focus:ring-0 px-4 group">
                           <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors overflow-hidden">
                              <Users className="h-4 w-4" />
                              <div className="flex-1 text-left truncate">
                                <SelectValue placeholder="All Teams" />
                              </div>
                           </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-primary/10 shadow-xl">
                            <SelectItem value="All">All Teams</SelectItem>
                            {teams.map((team) => (
                                <SelectItem key={team.id} value={team.id}>
                                    {team.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-border/40 bg-card/40 backdrop-blur-md shadow-sm">
                <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_auto] items-center border-b border-border/40 bg-secondary/20 px-8 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground/70 md:grid">
                    <span>Task Context</span>
                    <span className="flex items-center gap-2">Team <ChevronRight className="h-3 w-3" /></span>
                    <span>Status</span>
                    <span>Assignee</span>
                    <span className="text-right">Due Date</span>
                </div>

                {filteredTasks.length > 0 ? (
                    <div className="divide-y divide-border/40">
                        <AnimatePresence mode="popLayout">
                        {filteredTasks.map((task, index) => {
                            const team = teams.find((item) => item.id === task.team_id);

                            return (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    className="group grid gap-4 px-8 py-6 md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:items-center hover:bg-primary/5 transition-all duration-300 relative"
                                >
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                          <p className="font-bold text-foreground group-hover:text-primary transition-colors text-lg leading-tight">
                                            {task.title}
                                          </p>
                                          {index === 0 && (
                                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" title="Recent activity" />
                                          )}
                                        </div>
                                        <p className="text-xs font-medium text-muted-foreground line-clamp-1 max-w-[400px]">
                                          {task.description || "No context provided for this task."}
                                        </p>
                                    </div>

                                    <div className="flex items-center">
                                      <Link href={`/teams/${team?.id}`} className="inline-flex items-center gap-2 bg-secondary/40 px-2.5 py-1 rounded-lg border border-transparent hover:border-primary/20 hover:bg-background transition-all">
                                        <span className="text-[10px] font-bold text-foreground truncate max-w-[120px]">
                                          {team?.name ?? "Global"}
                                        </span>
                                      </Link>
                                    </div>

                                    <div>
                                        {task.status ? (
                                            <StatusBadge status={dbToBadgeStatus[task.status]} />
                                        ) : (
                                            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest italic">Unassigned</span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2.5">
                                        <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-black text-primary">
                                          {task.created_by_name?.slice(0, 2).toUpperCase() || "OP"}
                                        </div>
                                        <span className="text-xs font-bold text-foreground/80">{task.created_by_name ?? "Operator"}</span>
                                    </div>

                                    <div className="flex items-center justify-between gap-6 md:justify-end">
                                        <span className={cn(
                                          "inline-flex items-center gap-1.5 text-[11px] font-bold",
                                          task.deadline ? "text-muted-foreground" : "text-muted-foreground/30 italic"
                                        )}>
                                            <Calendar className="h-3.5 w-3.5" />
                                            {formatDeadline(task.deadline)}
                                        </span>
                                        <Link href={`/tasks/${task.id}`}>
                                            <Button variant="ghost" size="icon" className="group/btn rounded-xl hover:bg-primary/10 transition-colors">
                                                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover/btn:text-primary transition-all group-hover/btn:translate-x-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-secondary/5 text-center">
                        <div className="h-20 w-20 rounded-full bg-secondary/30 flex items-center justify-center mb-6">
                            <SearchX className="h-10 w-10 text-muted-foreground/60" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">No tasks matched</h3>
                        <p className="text-muted-foreground text-sm max-w-xs mb-8 leading-relaxed">
                          Try adjusting your search criteria or create a fresh task for your team.
                        </p>
                        <div className="flex items-center gap-3">
                           <Button variant="outline" onClick={() => {setQuery(""); setStatusFilter("All"); setTeamFilter("All");}} className="rounded-xl font-bold px-6 border-border/60">
                              Clear View
                           </Button>
                           <Link href="/tasks/create">
                              <Button className="rounded-xl font-bold px-6 bg-primary text-primary-foreground group">
                                <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
                                Create Task
                              </Button>
                           </Link>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
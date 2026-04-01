"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
   ArrowLeft,
   Calendar,
   Plus,
   Sparkles,
   User,
   Users,
   Info,
   Clock,
   ArrowRight,
   Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createTask } from "../server/task.mutations";
import { fetchUsersByTeamId } from "@/features/members/server/member.queries";
import { getWorkspaceSummary } from "@/features/teams/server/workspace.queries";

const PRIORITY_OPTIONS = [
   { label: "Low", value: "low" },
   { label: "Medium", value: "medium" },
   { label: "High", value: "high" },
] as const;

type CreateTaskFormData = {
   title: string;
   description: string;
   priority: string;
   team_id: string;
   assigned_user_ids: string[];
   deadline: string;
};

const initialFormData = {
   title: "",
   description: "",
   priority: PRIORITY_OPTIONS[1].value,
   team_id: "",
   assigned_user_ids: [],
   deadline: "",
} satisfies CreateTaskFormData;

export default function CreateTaskForm() {

   const router = useRouter();
   const [formData, setFormData] = useState<CreateTaskFormData>(initialFormData);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [teams, setTeams] = useState<DbTeamWithRelations[]>([]);
   const [users, setUsers] = useState<AppUser[]>([]);
   const [isLoadingData, setIsLoadingData] = useState(true);
   const [isLoadingMembers, setIsLoadingMembers] = useState(false);

   const teamMembers = users.filter((user) => !!user?.id);

   const loadMembersForTeam = async (teamId: string) => {
      if (!teamId) {
         setUsers([]);
         return;
      }

      setIsLoadingMembers(true);
      try {
         const members = await fetchUsersByTeamId(teamId);
         setUsers(members || []);
      } catch (err) {
         console.error("Error loading team members:", err);
         const message = "Failed to load team members";
         setError(message);
         toast.error(message);
      } finally {
         setIsLoadingMembers(false);
      }
   };

   useEffect(() => {
      const loadData = async () => {
         try {
            setIsLoadingData(true);
            const teamsData = await getWorkspaceSummary();

            setTeams(teamsData);

            // Set first team as default if available
            if (teamsData && teamsData.length > 0) {
               const initialTeamId = teamsData[0].id;
               setFormData(prev => ({
                  ...prev,
                  team_id: initialTeamId
               }));
               await loadMembersForTeam(initialTeamId);
            }
         } catch (err) {
            console.error("Error loading data:", err);
            const message = "Failed to load teams and members";
            setError(message);
            toast.error(message);
         } finally {
            setIsLoadingData(false);
         }
      };

      loadData();
   }, []);

   const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
   ) => {
      const { id, value } = e.target;
      setFormData(prev => ({
         ...prev,
         [id]: value
      }));
   };

   const handleTeamChange = async (teamId: string) => {
      setError(null);

      setFormData((prev) => ({
         ...prev,
         team_id: teamId,
         assigned_user_ids: [],
      }));

      await loadMembersForTeam(teamId);
   };

   const handleAssigneeToggle = (userId: string) => {
      setFormData((prev) => {
         const exists = prev.assigned_user_ids.includes(userId);
         return {
            ...prev,
            assigned_user_ids: exists
               ? prev.assigned_user_ids.filter((id) => id !== userId)
               : [...prev.assigned_user_ids, userId],
         };
      });
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!formData.title.trim()) {
         const message = "Task title is required";
         setError(message);
         toast.error(message);
         return;
      }

      setIsLoading(true);
      try {
         const result = await createTask({
            title: formData.title,
            description: formData.description,
            status: "todo",
            priority: formData.priority,
            team_id: formData.team_id || null,
            assigned_user_ids: formData.assigned_user_ids,
            deadline: formData.deadline || null,
         });

         if (result.success) {
            toast.success(result.message || "Task created successfully");
            router.push("/tasks");
         } else {
            const message = result.error || "Failed to create task";
            setError(message);
            toast.error(message);
         }
      } catch (err) {
         const message = err instanceof Error ? err.message : "An error occurred";
         setError(message);
         toast.error(message);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="max-w-4xl mx-auto py-8">
         <Link
            href="/tasks"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-blue-600 mb-8 transition-colors group"
         >
            <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
            Back to Tasks
         </Link>

         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b">
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                     <Plus className="h-5 w-5 text-blue-600" />
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">New Task</h1>
               </div>
               <p className="text-gray-500 text-lg">Define a new objective and assign it to your team.</p>
            </div>

            <Button variant="outline" className="h-11 px-6 border-blue-100 bg-blue-50/30 text-blue-600 hover:bg-blue-100 rounded-xl font-bold uppercase text-[10px] tracking-widest gap-2">
               <Sparkles className="h-4 w-4" /> AI Suggest (Beta)
            </Button>
         </div>

         <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {error && (
               <div className="lg:col-span-3 p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm font-medium text-red-800">{error}</p>
               </div>
            )}

            <div className="lg:col-span-2 space-y-8">
               <Card className="border-none shadow-2xl shadow-blue-50/50 bg-white p-2">
                  <CardContent className="pt-8 space-y-8">
                     <div className="space-y-3">
                        <label htmlFor="title" className="text-sm font-bold uppercase tracking-widest text-gray-400">
                           Task Title
                        </label>
                        <Input
                           id="title"
                           placeholder="e.g. Navigation Refactor"
                           className="h-14 text-xl font-bold bg-gray-50/50 border-gray-100 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-blue-200 rounded-xl px-6"
                           value={formData.title}
                           onChange={handleInputChange}
                           required
                        />
                     </div>

                     <div className="space-y-3">
                        <label htmlFor="description" className="text-sm font-bold uppercase tracking-widest text-gray-400">
                           Description
                        </label>
                        <Textarea
                           id="description"
                           placeholder="What needs to be done? Use markdown for details."
                           className="min-h-62.5 text-lg bg-gray-50/50 border-gray-100 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-blue-200 resize-none p-6 rounded-xl leading-relaxed"
                           value={formData.description}
                           onChange={handleInputChange}
                        />
                     </div>
                  </CardContent>
               </Card>
            </div>

            <div className="space-y-8">
               <Card className="border-none shadow-xl shadow-gray-100 bg-gray-50/30 p-1">
                  <CardContent className="pt-8 space-y-8">
                     <div className="space-y-4">
                        <label className="text-sm font-bold uppercase tracking-widest text-gray-400">
                           Parameters
                        </label>

                        <div className="space-y-6">
                           <div className="flex flex-col gap-2">
                              <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                 <Users className="h-3 w-3 text-blue-500" /> Team Workspace
                              </span>
                              <select
                                 id="team_id"
                                 value={formData.team_id}
                                 onChange={(e) => void handleTeamChange(e.target.value)}
                                 className="h-11 w-full rounded-xl border-gray-100 bg-white text-sm font-medium px-4 shadow-sm outline-none ring-blue-100 focus:ring-1"
                                 disabled={isLoadingData || isLoading}
                              >
                                 <option value="">Select a team...</option>
                                 {teams.map(team => (
                                    <option key={team.id} value={team.id}>{team.name}</option>
                                 ))}
                              </select>
                           </div>

                           <div className="flex flex-col gap-2">
                              <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                 <User className="h-3 w-3 text-blue-500" /> Assign Members
                              </span>
                              <div className="max-h-36 overflow-y-auto rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-sm space-y-2">
                                 {teamMembers.length === 0 ? (
                                    <p className="text-xs text-gray-400 py-1">No members found for this team.</p>
                                 ) : (
                                    teamMembers.map((user) => {
                                       const userId = user?.id;
                                       if (!userId) {
                                          return null;
                                       }

                                       const isChecked = formData.assigned_user_ids.includes(userId);

                                       return (
                                          <label key={userId} className="flex items-center gap-2 text-sm text-gray-700">
                                             <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleAssigneeToggle(userId)}
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                disabled={isLoadingData || isLoadingMembers}
                                             />
                                             <span>{user?.name || "Unknown"}</span>
                                          </label>
                                       );
                                    })
                                 )}
                              </div>
                           </div>

                           <div className="flex flex-col gap-2">
                              <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                 <Calendar className="h-3 w-3 text-blue-500" /> Due Date
                              </span>
                              <div className="relative">
                                 <Input
                                    id="deadline"
                                    type="date"
                                    className="h-11 rounded-xl border-gray-100 bg-white text-sm font-medium pr-4 shadow-sm"
                                    value={formData.deadline}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                 />
                              </div>
                           </div>

                           <div className="flex flex-col gap-2">
                              <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                 <Clock className="h-3 w-3 text-blue-500" /> Priority
                              </span>
                              <div className="flex gap-2">
                                 {PRIORITY_OPTIONS.map((option) => (
                                    <Button
                                       key={option.value}
                                       type="button"
                                       variant="outline"
                                       size="sm"
                                       onClick={() => setFormData((prev) => ({ ...prev, priority: option.value }))}
                                       className={cn(
                                          "flex-1 h-10 border-gray-100 bg-white rounded-lg text-[10px] font-bold uppercase tracking-wider",
                                          formData.priority === option.value && "border-rose-100 text-rose-500"
                                       )}
                                       disabled={isLoading}
                                    >
                                       {option.label}
                                    </Button>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                  </CardContent>
                  <CardFooter className="pt-8 pb-8 px-8 border-t bg-gray-50/50 rounded-b-2xl">
                     <div className="w-full space-y-3">
                        <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-100 rounded-xl transition-all hover:scale-102 active:scale-98 group" disabled={isLoading || isLoadingData || isLoadingMembers}>
                           {isLoading ? (
                              <>
                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                 Creating...
                              </>
                           ) : (
                              <>
                                 Create Task <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </>
                           )}
                        </Button>
                        <Link href="/tasks" className="block w-full">
                           <Button variant="ghost" type="button" className="w-full h-12 font-bold text-gray-400 hover:text-gray-600" disabled={isLoading}>
                              Discard
                           </Button>
                        </Link>
                     </div>
                  </CardFooter>
               </Card>

               <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-4">
                  <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800/80 font-medium leading-relaxed">
                     Assigning a due date helps your team prioritize work and keeps projects on schedule.
                  </p>
               </div>
            </div>
         </form>
      </div>
   );
}

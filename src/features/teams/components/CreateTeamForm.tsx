"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Plus, Users, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createWorkspace } from "@/features/teams/server/workspace.mutations";

export default function CreateTeamForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.name.trim()) {
      const message = "Team name is required";
      setError(message);
      toast.error(message);
      return;
    }

    setIsLoading(true);
    try {
      const result = await createWorkspace({
        name: formData.name,
        description: formData.description
      });

      if (result.success) {
        toast.success(result.message || "Team created successfully");
        router.push("/teams");
      } else {
        const message = result.error || "Failed to create team";
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
    <div className="max-w-2xl mx-auto py-8">
      <Link 
        href="/teams" 
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-blue-600 mb-8 transition-colors group"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
        Back to Teams
      </Link>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
            <Plus className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Create New Team</h1>
        </div>
        <p className="text-gray-500 mb-10 text-lg">Build a new workspace for your project collaboration.</p>

        <Card className="border-none shadow-2xl shadow-blue-50/50 bg-white p-2">
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-8 space-y-8">
              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              )}
              
              <div className="space-y-3">
                <label htmlFor="name" className="text-sm font-bold uppercase tracking-widest text-gray-500">
                  Team Name
                </label>
                <Input 
                  id="name" 
                  placeholder="e.g. Design System 2.0" 
                  className="h-12 text-lg font-medium bg-gray-50 border-gray-100 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-blue-200" 
                  required 
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1 font-medium">
                   <Info className="h-3.5 w-3.5 text-blue-500" /> This will be your workspace unique identifier.
                </p>
              </div>

              <div className="space-y-3">
                <label htmlFor="description" className="text-sm font-bold uppercase tracking-widest text-gray-500">
                  Description (Optional)
                </label>
                <Textarea 
                  id="description" 
                  placeholder="What is this team working on?" 
                  className="min-h-35 text-md bg-gray-50 border-gray-100 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-blue-200 resize-none p-4"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 border-dashed flex items-center gap-4 group cursor-pointer hover:bg-blue-100 transition-all">
                 <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                    <Users className="h-5 w-5" />
                 </div>
                 <div className="flex flex-col">
                    <span className="font-bold text-blue-900 text-sm">Add Team Members</span>
                    <span className="text-xs text-blue-700/70 font-medium">Invite colleagues to join this workspace</span>
                 </div>
                 <Plus className="ml-auto h-5 w-5 text-blue-400" />
              </div>
            </CardContent>
            <CardFooter className="pt-8 pb-8 flex justify-end gap-3 px-8 border-t bg-gray-50/30 rounded-b-2xl">
              <Link href="/teams">
                <Button variant="ghost" className="h-12 px-6 font-semibold" disabled={isLoading}>Cancel</Button>
              </Link>
              <Button type="submit" className="h-12 px-8 bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95 group" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Workspace <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 
  Plus, 
  Sparkles, 
  User, 
  Users,
  Layout, 
  CheckCircle2,
  Info,
  Clock,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_USERS, MOCK_TEAMS } from "@/lib/mock-data";

export default function CreateTaskPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-blue-600 mb-8 transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          Back to Workspace
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
                        <select className="h-11 w-full rounded-xl border-gray-100 bg-white text-sm font-medium px-4 shadow-sm outline-none ring-blue-100 focus:ring-1">
                          {MOCK_TEAMS.map(team => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                          <User className="h-3 w-3 text-blue-500" /> Assign To
                        </span>
                        <select className="h-11 w-full rounded-xl border-gray-100 bg-white text-sm font-medium px-4 shadow-sm outline-none ring-blue-100 focus:ring-1">
                          {MOCK_USERS.map(user => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-blue-500" /> Due Date
                        </span>
                        <div className="relative">
                          <Input 
                            type="date" 
                            className="h-11 rounded-xl border-gray-100 bg-white text-sm font-medium pr-4 shadow-sm" 
                            defaultValue="2024-03-31" 
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                          <Clock className="h-3 w-3 text-blue-500" /> Priority
                        </span>
                        <div className="flex gap-2">
                          {['Low', 'Medium', 'High'].map(p => (
                            <Button key={p} type="button" variant="outline" size="sm" className={cn("flex-1 h-10 border-gray-100 bg-white rounded-lg text-[10px] font-bold uppercase tracking-wider", p === 'High' && "border-rose-100 text-rose-500")}>
                               {p}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-8 pb-8 px-8 border-t bg-gray-50/50 rounded-b-2xl">
                  <div className="w-full space-y-3">
                    <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-100 rounded-xl transition-all hover:scale-102 active:scale-98 group">
                      Create Task <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Link href="/dashboard" className="block w-full">
                      <Button variant="ghost" type="button" className="w-full h-12 font-bold text-gray-400 hover:text-gray-600">
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

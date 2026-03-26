"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  CheckCircle2, 
  Settings,
  MoreVertical,
  MessageSquare,
  Paperclip,
  Share2,
  AlertCircle,
  Zap,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { StatusBadge } from "@/features/tasks/components/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_TASKS, MOCK_USERS } from "@/lib/mock-data";

export default function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
   const { id } = React.use(params);
   const task = MOCK_TASKS.find(t => t.id === id) || MOCK_TASKS[0];

  return (
      <div className="max-w-5xl mx-auto py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
            Back to Team
          </Link>
          <div className="flex gap-2">
             <Button variant="outline" size="sm" className="h-9 px-4 border-gray-200 bg-white">
                <Share2 className="mr-2 h-4 w-4" /> Share
             </Button>
             <Button variant="outline" size="sm" className="h-9 px-4 border-gray-200 bg-white">
                <Settings className="mr-2 h-4 w-4" /> Edit Task
             </Button>
             <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreVertical className="h-4 w-4" />
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Main Content Area */}
           <div className="lg:col-span-3 space-y-8">
              <Card className="border-none shadow-2xl shadow-blue-50/50 bg-white p-2">
                 <CardContent className="pt-10 px-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-10 border-b border-gray-50 border-dashed">
                       <div className="space-y-4">
                          <div className="flex items-center gap-3">
                             <StatusBadge status={task.status} className="h-6 px-3 text-xs" />
                             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-3 border-l">#{task.id}</span>
                          </div>
                          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">{task.title}</h1>
                       </div>
                       
                       <div className="flex items-center gap-4">
                          <Button className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-100 rounded-xl transition-all hover:scale-105 active:scale-95 group">
                             <CheckCircle2 className="mr-2 h-5 w-5" /> Mark Completed
                          </Button>
                       </div>
                    </div>

                    <div className="prose prose-blue max-w-none mb-12">
                       <h3 className="text-md font-bold uppercase tracking-widest text-gray-400 mb-6">Task Description</h3>
                       <p className="text-lg text-gray-600 leading-relaxed font-normal whitespace-pre-wrap">
                          {task.description}
                       </p>
                    </div>

                    <Tabs defaultValue="Comments" className="w-full mt-16 pt-10 border-t border-gray-50">
                       <TabsList className="bg-gray-50/50 p-1 rounded-xl h-11 border border-gray-100 mb-8 self-start">
                          <TabsTrigger value="Comments" className="rounded-lg px-8 h-9 font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                             Comments <span className="ml-2 text-xs font-medium text-gray-400">12</span>
                          </TabsTrigger>
                          <TabsTrigger value="Activity" className="rounded-lg px-8 h-9 font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                             Activity
                          </TabsTrigger>
                          <TabsTrigger value="Files" className="rounded-lg px-8 h-9 font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                             Files
                          </TabsTrigger>
                       </TabsList>
                       
                       <TabsContent value="Comments" className="mt-4 space-y-8">
                          <div className="flex gap-4 items-start pt-6 border-t border-gray-50 group first:border-none first:pt-0">
                             <Avatar className="h-10 w-10 border-2 border-white ring-2 ring-blue-50">
                                <AvatarImage src={MOCK_USERS[1].avatar} />
                                <AvatarFallback>SM</AvatarFallback>
                             </Avatar>
                             <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                   <div className="flex items-center gap-2">
                                      <span className="font-bold text-gray-900 text-sm">Sarah Miller</span>
                                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2 border-l">2 hours ago</span>
                                   </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                       <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-gray-600 text-md leading-relaxed">
                                   Great progress on the navigation drawer! I've uploaded the new SVGs for the icons in the sidebar. Let me know if you need any adjustments.
                                </p>
                                <div className="flex items-center gap-4 pt-2">
                                   <Button variant="ghost" size="sm" className="h-8 px-2 text-xs font-bold text-gray-500 hover:text-blue-600">Reply</Button>
                                   <Button variant="ghost" size="sm" className="h-8 px-2 text-xs font-bold text-gray-500 hover:text-blue-600">Like</Button>
                                </div>
                             </div>
                          </div>
                          
                          <div className="mt-12 flex gap-4 pt-10 border-t border-gray-100">
                             <Avatar className="h-10 w-10 border-2 border-white ring-2 ring-gray-100">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>AJ</AvatarFallback>
                             </Avatar>
                             <div className="flex-1 relative group">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm group-focus-within:bg-white group-focus-within:border-blue-200 transition-all">
                                   <textarea 
                                      placeholder="Write a comment..." 
                                      className="w-full min-h-25 resize-none border-none bg-transparent text-lg text-gray-700 outline-none"
                                   />
                                   <div className="flex items-center justify-between mt-4">
                                      <div className="flex gap-2">
                                         <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                                            <Paperclip className="h-4 w-4" />
                                         </Button>
                                         <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                                            <MessageSquare className="h-4 w-4" />
                                         </Button>
                                      </div>
                                      <Button className="h-10 px-6 bg-blue-600 hover:bg-blue-700 font-bold uppercase text-[10px] tracking-widest rounded-xl transition-all hover:scale-105">
                                         Post Comment
                                      </Button>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </TabsContent>
                    </Tabs>
                 </CardContent>
              </Card>
           </div>

           {/* Sidebar Info Area */}
           <div className="lg:col-span-1 space-y-8">
              <Card className="border-none shadow-xl shadow-gray-100 bg-white p-1 overflow-hidden">
                 <CardHeader className="pt-8 px-8 border-b border-gray-50 pb-6 mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Task Information</h3>
                 </CardHeader>
                 <CardContent className="px-8 space-y-10 pb-8">
                    <div className="flex flex-col gap-4 group">
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <User className="h-3 w-3 text-blue-500" /> Assignee
                       </span>
                       <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 group-hover:bg-blue-50/30 transition-all border border-transparent group-hover:border-blue-50">
                          <Avatar className="h-10 w-10 border-2 border-white ring-2 ring-gray-100">
                             <AvatarImage src={task.assignee.avatar} />
                             <AvatarFallback>AJ</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                             <span className="text-sm font-bold text-gray-900">{task.assignee.name}</span>
                             <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Lead Developer</span>
                          </div>
                          <div className="ml-auto flex items-center justify-center h-6 w-6 rounded-full group-hover:bg-white text-gray-300 transition-colors">
                             <ChevronDown className="h-4 w-4" />
                          </div>
                       </div>
                    </div>

                    <div className="flex flex-col gap-3">
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-blue-500" /> Timeline
                       </span>
                       <div className="space-y-4 pt-1">
                          <div className="flex items-center justify-between text-sm">
                             <span className="text-gray-500 font-medium">Started On</span>
                             <span className="font-bold text-gray-900">{task.dueDate.split('-').map((v, i) => i === 2 ? parseInt(v)-5 : v).join('-')}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                             <span className="text-gray-500 font-medium">Due Date</span>
                             <span className="font-bold text-rose-500">{task.dueDate}</span>
                          </div>
                          <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "65%" }}
                                className="h-full bg-blue-600"
                             />
                          </div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">65% Time Used</p>
                       </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <AlertCircle className="h-3 w-3 text-blue-500" /> Priority
                       </span>
                       <div className="pt-2">
                          <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-between group cursor-help">
                             <span className="text-sm font-extrabold text-red-900 uppercase tracking-wider">High Priority</span>
                             <ArrowRight className="h-4 w-4 text-red-300 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                       </div>
                    </div>
                 </CardContent>
                 <CardFooter className="pt-8 pb-8 px-8 border-t bg-gray-50/30">
                    <Button variant="outline" className="w-full h-12 border-gray-100 bg-white font-bold text-gray-400 hover:text-red-500 hover:bg-rose-50 transition-all rounded-xl hover:border-rose-100">
                       Delete Task
                    </Button>
                 </CardFooter>
              </Card>

              <div className="p-8 rounded-3xl bg-blue-600 shadow-xl shadow-blue-100 relative overflow-hidden group">
                 <div className="relative z-10 transition-transform group-hover:scale-105 duration-300">
                   <h4 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
                      <Zap className="h-5 w-5 fill-white" /> AI Summary
                   </h4>
                   <p className="text-blue-100 text-xs font-medium leading-relaxed">
                      "Recent discussions suggest that the navigation components need to be modularized to avoid re-renders across route changes."
                   </p>
                 </div>
                 <div className="absolute -bottom-8 -right-8 h-32 w-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
              </div>
           </div>
        </div>
         </div>
  );
}

function ChevronDown(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

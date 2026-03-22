"use client";

import React from "react";
import Link from "next/link";
import { Plus, Users, Layout, MoreVertical, Search, Filter, Calendar, FolderOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MOCK_TEAMS } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Workspace Dashboard</h1>
            <p className="text-muted-foreground mt-1">Select a team to view progress or manage workflows.</p>
          </div>
          <Link href="/teams/create">
            <Button className="h-11 px-6 bg-blue-600 hover:bg-blue-700 shadow-md transition-all hover:scale-105 active:scale-95">
              <Plus className="mr-2 h-5 w-5" />
              Create Team
            </Button>
          </Link>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-none shadow-xl shadow-blue-50/50 hover:shadow-blue-100 transition-all border-l-4 border-l-blue-600">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Active Projects</p>
                  <h3 className="text-3xl font-bold mt-2">12</h3>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Layout className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 font-medium mt-4">+2 from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-none shadow-xl shadow-indigo-50/50 hover:shadow-indigo-100 transition-all border-l-4 border-l-indigo-600">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Team Members</p>
                  <h3 className="text-3xl font-bold mt-2">48</h3>
                </div>
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 font-medium mt-4">+5 new joins</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-none shadow-xl shadow-emerald-50/50 hover:shadow-emerald-100 transition-all border-l-4 border-l-emerald-600">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Completed Tasks</p>
                  <h3 className="text-3xl font-bold mt-2">1,204</h3>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-4">98% success rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-center gap-4 py-2">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Filter teams..." className="pl-9 h-11 bg-white border-gray-200" />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" className="h-11 px-4 border-gray-200 bg-white">
              <Filter className="mr-2 h-4 w-4" />
              Sort
            </Button>
            <Button variant="outline" className="h-11 px-4 border-gray-200 bg-white">
              <Layout className="mr-2 h-4 w-4" />
              Grid
            </Button>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {MOCK_TEAMS.map((team, idx) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href={`/teams/${team.id}`}>
                <Card className="group hover:ring-2 hover:ring-blue-600/10 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 border-none shadow-lg h-full bg-white">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xl font-bold leading-none tracking-tight group-hover:text-blue-600 transition-colors">
                      {team.name}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 uppercase text-[10px] font-bold tracking-widest border-none">
                      Active
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed h-10">
                      {team.description}
                    </p>
                    <div className="mt-8 flex items-center justify-between border-t pt-6">
                      <div className="flex -space-x-3 overflow-hidden">
                        {team.members.map((member, i) => (
                          <Avatar key={i} className="inline-block border-2 border-white ring-2 ring-gray-100 h-9 w-9">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                        <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg border">
                          <FolderOpen className="h-3.5 w-3.5" />
                          {team.taskCount} Tasks
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50/50 py-4 px-6 rounded-b-xl border-t flex justify-center">
                    <span className="text-xs font-bold text-gray-400 group-hover:text-blue-600 transition-colors uppercase tracking-widest flex items-center gap-2">
                      View Workspace <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}

          <Link href="/teams/create" className="h-full">
            <Card className="h-full border-2 border-dashed border-gray-200 bg-gray-50/10 hover:bg-blue-50 hover:border-blue-200 transition-all group flex flex-col items-center justify-center p-8 cursor-pointer rounded-2xl shadow-none">
              <div className="h-14 w-14 rounded-full bg-blue-600/5 group-hover:bg-blue-600/10 flex items-center justify-center mb-6 ring-2 ring-blue-600/10 transition-all group-hover:scale-110">
                <Plus className="h-7 w-7 text-blue-600" />
              </div>
              <p className="font-bold text-gray-900 text-lg mb-2">Create New Team</p>
              <p className="text-sm text-gray-500 text-center">Add another team to your unified workspace</p>
            </Card>
          </Link>
        </div>
      </div>
  );
}

function CheckCircle2(props: any) {
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
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ArrowRight(props: any) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

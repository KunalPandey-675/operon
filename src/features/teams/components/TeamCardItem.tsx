"use client";

import Link from "next/link";
import { 
  LayoutGrid, 
  Users, 
  ChevronRight, 
  MoreVertical,
  Activity,
  Calendar
} from "lucide-react";
import { AvatarGroup } from "@/features/teams/components/AvatarGroup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamListItem } from "@/features/teams/components/teams-list.types";
import { motion } from "framer-motion";

type TeamCardItemProps = {
  team: TeamListItem;
};

export function TeamCardItem({ team }: TeamCardItemProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                {team.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  {team.taskCount} active tasks
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="line-clamp-2 min-h-[40px] text-sm leading-relaxed text-muted-foreground">
            {team.description || "No description available for this team workspace."}
          </p>
          
          <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/50">
            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-foreground">{team.taskCount} Tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">Mar 2026</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Members</p>
               <AvatarGroup users={team.members} max={4} />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 px-6 pb-6">
          <Link href={`/teams/${team.id}`} className="w-full">
            <Button variant="outline" className="w-full h-11 rounded-xl font-semibold border-border/60 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all group/btn">
              <LayoutGrid className="mr-2 h-4 w-4" /> 
              Open Dashboard
              <ChevronRight className="ml-1 h-4 w-4 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}


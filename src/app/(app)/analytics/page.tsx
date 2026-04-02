"use client";

import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const stats = [
  {
    title: "Team Velocity",
    value: "42.5",
    unit: "pts/w",
    trend: "+12.5%",
    trendUp: true,
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Tasks Completed",
    value: "1,284",
    unit: "total",
    trend: "+8.2%",
    trendUp: true,
    icon: Target,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Active Members",
    value: "328",
    unit: "users",
    trend: "-2.1%",
    trendUp: false,
    icon: Users,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    title: "Project Health",
    value: "96%",
    unit: "uptime",
    trend: "+0.4%",
    trendUp: true,
    icon: Activity,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

export default function AnalyticsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h1 className="text-4xl font-black tracking-tight text-foreground">Analytics</h1>
            </div>
            <p className="text-muted-foreground text-sm font-medium">Real-time performance metrics and strategic insights for your entire workspace.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="h-10 px-4 rounded-xl border-border/60 bg-card/30 font-bold flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Last 30 Days
          </Badge>
          <Button variant="premium" size="sm" className="h-10 rounded-xl px-4 font-bold">
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className="border-border/40 bg-card/40 backdrop-blur-sm hover:border-primary/20 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                  {stat.title}
                </CardTitle>
                <div className={cn("p-2 rounded-xl transition-transform group-hover:scale-110", stat.bg)}>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black tracking-tighter text-foreground">{stat.value}</span>
                  <span className="text-xs font-bold text-muted-foreground/60 tracking-wide select-none">{stat.unit}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-3">
                   <div className={cn(
                     "flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-lg",
                     stat.trendUp ? "text-emerald-500 bg-emerald-500/10" : "text-rose-500 bg-rose-500/10"
                   )}>
                      {stat.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {stat.trend}
                   </div>
                   <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">vs prev period</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-border/40 bg-card/40 backdrop-blur-md shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <Layers className="h-48 w-48 text-primary" />
           </div>
           <CardHeader>
             <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="rounded-full px-3 bg-primary/10 text-primary border-none font-bold text-[10px]">OPERATIONAL EFFICIENCY</Badge>
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-6 w-6 rounded-full border-2 border-card bg-secondary" />
                  ))}
                </div>
             </div>
             <CardTitle className="text-2xl font-black tracking-tight">Sprint Evolution</CardTitle>
             <CardDescription className="text-muted-foreground/80 font-medium italic">Tracking velocity and burn-down rates across all active teams.</CardDescription>
           </CardHeader>
           <CardContent>
             <div className="h-[300px] w-full flex items-end gap-3 px-2 pt-8">
                {[45, 62, 58, 75, 90, 82, 95, 100, 85, 92, 110, 105].map((h, i) => (
                  <div key={i} className="flex-1 group relative">
                     <motion.div 
                       initial={{ height: 0 }}
                       animate={{ height: `${h}%` }}
                       transition={{ duration: 1, delay: 0.5 + i * 0.05, ease: "easeOut" }}
                       className={cn(
                        "w-full rounded-t-xl transition-all duration-300 group-hover:bg-primary/80 relative overflow-hidden",
                        i === 10 ? "bg-primary shadow-lg shadow-primary/20" : "bg-primary/20"
                       )}
                     >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                     </motion.div>
                     <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all text-[8px] font-black text-muted-foreground whitespace-nowrap">
                        WEEK {i + 1}
                     </div>
                  </div>
                ))}
             </div>
             <div className="mt-12 flex items-center justify-center gap-8 border-t border-border/40 pt-6">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                   <div className="h-2 w-2 rounded-full bg-primary" /> Actual Velocity
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                   <div className="h-2 w-2 rounded-full bg-primary/20" /> Projected Trend
                </div>
             </div>
           </CardContent>
        </Card>

        <div className="space-y-8">
           <Card className="border-border/40 bg-foreground dark:bg-zinc-900 text-background dark:text-foreground shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 h-32 w-32 bg-primary/20 rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-700" />
              <CardHeader>
                <div className="flex items-center gap-2 mb-4">
                   <div className="p-2 bg-primary/20 rounded-lg">
                      <Sparkles className="h-4 w-4 text-primary" />
                   </div>
                   <span className="text-[10px] font-black tracking-widest text-primary">SQUAD INTELLIGENCE</span>
                </div>
                <CardTitle className="text-xl font-black leading-tight text-white dark:text-white">Recommended Strategy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <p className="text-sm font-medium leading-relaxed text-zinc-400">
                    Based on your workspace throughput of <span className="text-white font-bold">126 tasks/wk</span>, you should allocate more resources to the <span className="text-primary font-bold underline underline-offset-4 decoration-primary/50">Internal Infrastructure</span> team to avoid a bottleneck in Q3.
                 </p>
                 <Button variant="premium" className="w-full h-11 rounded-xl shadow-none font-bold text-xs ring-1 ring-white/10">
                    Generate Executive View
                 </Button>
              </CardContent>
           </Card>

           <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-sm">
              <CardHeader>
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
                   <TrendingUp className="h-3.5 w-3.5" /> High Performers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                 {[
                   { name: "Design System", pts: 84 },
                   { name: "API Optimization", pts: 72 },
                   { name: "Frontend Sprint", pts: 65 }
                 ].map((team, idx) => (
                   <div key={team.name} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-[10px] font-black">#{idx + 1}</div>
                         <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{team.name}</span>
                      </div>
                      <Badge variant="outline" className="rounded-lg border-border/60 font-black text-[10px]">{team.pts} pts</Badge>
                   </div>
                 ))}
              </CardContent>
           </Card>
        </div>
      </div>
    </motion.div>
  );
}

import { Button } from "@/components/ui/button";
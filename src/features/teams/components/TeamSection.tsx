import { TeamCardItem } from "@/features/teams/components/TeamCardItem";
import { TeamListItem } from "@/features/teams/components/teams-list.types";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

type TeamSectionProps = {
  title: string;
  teams: TeamListItem[];
  emptyMessage: string;
};

export function TeamSection({ title, teams, emptyMessage }: TeamSectionProps) {
  if (teams.length === 0) return (
    <div className="rounded-2xl border border-dashed border-border/60 bg-secondary/10 p-12 text-center transition-all hover:bg-secondary/20">
      <p className="text-sm font-medium text-muted-foreground">{emptyMessage}</p>
    </div>
  );

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
        <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 bg-primary/10 text-primary border-none font-bold text-xs">
          {teams.length}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {teams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <TeamCardItem team={team} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}


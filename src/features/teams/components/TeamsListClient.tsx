"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useCurrentUserId } from "@/components/providers/CurrentUserProvider";
import { joinWorkspaceByCode } from "@/features/teams/server/workspace.mutations";
import { TeamsHeaderActions } from "@/features/teams/components/TeamsHeaderActions";
import { JoinTeamSheet } from "@/features/teams/components/JoinTeamSheet";
import { TeamsFilters } from "@/features/teams/components/TeamsFilters";
import { TeamSection } from "@/features/teams/components/TeamSection";
import { TeamListItem, TeamSizeFilter } from "@/features/teams/components/teams-list.types";
import { motion } from "framer-motion";
import { SearchX, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function TeamsListClient({ teams }: { teams: TeamListItem[] }) {
  const router = useRouter();
  const userId = useCurrentUserId();
  const [query, setQuery] = useState("");
  const [sizeFilter, setSizeFilter] = useState<TeamSizeFilter>("All");
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const filteredTeams = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return teams.filter((team) => {
      const matchesQuery =
        normalized.length === 0 ||
        team.name.toLowerCase().includes(normalized) ||
        team.description.toLowerCase().includes(normalized);

      const memberCount = team.members.length;
      const matchesSize =
        sizeFilter === "All" ||
        (sizeFilter === "Small" && memberCount <= 2) ||
        (sizeFilter === "Medium" && memberCount >= 3 && memberCount <= 4) ||
        (sizeFilter === "Large" && memberCount >= 5);

      return matchesQuery && matchesSize;
    });
  }, [query, sizeFilter, teams]);

  const yourTeams = useMemo(
    () => filteredTeams.filter((team) => Boolean(userId) && team.createdBy === userId),
    [filteredTeams, userId],
  );

  const joinedTeams = useMemo(
    () =>
      filteredTeams.filter(
        (team) =>
          Boolean(userId) &&
          team.createdBy !== userId &&
          team.members.some((member) => member.user_id === userId),
      ),
    [filteredTeams, userId],
  );

  const handleJoinTeam = async () => {
    const normalizedCode = joinCode.trim().toUpperCase();
    if (!normalizedCode) {
      toast.error("Team code is required");
      return;
    }

    setIsJoining(true);
    try {
      const result = await joinWorkspaceByCode({
        code: normalizedCode,
      });

      if (!result.success) {
        toast.error(result.error || "Failed to join team");
        return;
      }

      toast.success(result.message || "Joined team successfully");
      setIsJoinModalOpen(false);
      setJoinCode("");

      if (result.data?.id) {
        router.push(`/teams/${result.data.id}`);
      } else {
        router.refresh();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to join team";
      toast.error(message);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <TeamsHeaderActions onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      <JoinTeamSheet
        open={isJoinModalOpen}
        onOpenChange={setIsJoinModalOpen}
        joinCode={joinCode}
        onJoinCodeChange={setJoinCode}
        isJoining={isJoining}
        onSubmit={handleJoinTeam}
        onCancel={() => setIsJoinModalOpen(false)}
      />

      <TeamsFilters
        query={query}
        onQueryChange={setQuery}
        sizeFilter={sizeFilter}
        onSizeFilterChange={setSizeFilter}
      />

      {filteredTeams.length > 0 ? (
        <div className="space-y-14">
          <TeamSection
            title="Teams You Own"
            teams={yourTeams}
            emptyMessage="You haven't created any teams matching these filters yet."
          />
          <TeamSection
            title="Teams You've Joined"
            teams={joinedTeams}
            emptyMessage="No joined teams match your current search criteria."
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-border/80 bg-secondary/5 text-center">
          <div className="h-20 w-20 rounded-full bg-secondary/30 flex items-center justify-center mb-6">
            <SearchX className="h-10 w-10 text-muted-foreground/60" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No teams found</h3>
          <p className="text-muted-foreground text-sm max-w-xs mb-8 leading-relaxed">
            We couldn't find any teams matching your search. Try adjusting your filters or create a new team.
          </p>
          <div className="flex items-center gap-3">
             <Button variant="outline" onClick={() => {setQuery(""); setSizeFilter("All");}} className="rounded-xl font-bold px-6 border-border/60">
                Clear Filters
             </Button>
             <Link href="/teams/create">
                <Button className="rounded-xl font-bold px-6 bg-primary text-primary-foreground group">
                  <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
                  Create Team
                </Button>
             </Link>
          </div>
        </div>
      )}
    </motion.div>
  );
}


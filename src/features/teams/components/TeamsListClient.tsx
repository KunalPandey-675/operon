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
    () => filteredTeams.filter((team) => !userId || team.createdBy !== userId),
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
        userId: userId ?? undefined,
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
    <div className="space-y-8">
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
        <div className="space-y-8">
          <TeamSection
            title="Your Teams"
            teams={yourTeams}
            emptyMessage="You don't own any teams that match the current filters."
          />
          <TeamSection
            title="Joined teams"
            teams={joinedTeams}
            emptyMessage="You haven't joined any teams that match the current filters."
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-12 text-center">
          <p className="font-semibold text-gray-700">No teams matched your filters.</p>
          <p className="mt-1 text-sm text-gray-500">Try a different search term or filter.</p>
        </div>
      )}
    </div>
  );
}

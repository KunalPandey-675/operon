"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LayoutGrid, Plus, Search, Users } from "lucide-react";
import { AvatarGroup } from "@/features/teams/components/AvatarGroup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MOCK_TEAMS } from "@/lib/mock-data";

type TeamSizeFilter = "All" | "Small" | "Medium" | "Large";

export default function TeamsPage() {
  const [query, setQuery] = useState("");
  const [sizeFilter, setSizeFilter] = useState<TeamSizeFilter>("All");

  const filteredTeams = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return MOCK_TEAMS.filter((team) => {
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
  }, [query, sizeFilter]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between pb-6 border-b">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Teams</h1>
          <p className="text-gray-500">Browse workspace teams and jump into their task boards.</p>
        </div>
        <Link href="/teams/create">
          <Button className="h-11 px-6 bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-100">
            <Plus className="mr-2 h-4 w-4" /> Create Team
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams by name or description..."
            className="h-11 pl-9"
          />
        </div>
        <select
          value={sizeFilter}
          onChange={(e) => setSizeFilter(e.target.value as TeamSizeFilter)}
          className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="All">All team sizes</option>
          <option value="Small">Small (1-2)</option>
          <option value="Medium">Medium (3-4)</option>
          <option value="Large">Large (5+)</option>
        </select>
      </div>

      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredTeams.map((team) => (
            <Card key={team.id} className="border border-gray-100 bg-white shadow-sm">
              <CardHeader className="space-y-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{team.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed min-h-10">{team.description}</p>
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <span>{team.taskCount} tasks</span>
                  <span>{team.members.length} members</span>
                </div>
                <AvatarGroup users={team.members} max={4} />
              </CardContent>
              <CardFooter>
                <Link href={`/teams/${team.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    <LayoutGrid className="mr-2 h-4 w-4" /> Open Team
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-12 text-center">
          <p className="font-semibold text-gray-700">No teams matched your filters.</p>
          <p className="text-sm text-gray-500 mt-1">Try a different search term or filter.</p>
        </div>
      )}
    </div>
  );
}
import Link from "next/link";
import { LayoutGrid, Users } from "lucide-react";
import { AvatarGroup } from "@/features/teams/components/AvatarGroup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamListItem } from "@/features/teams/components/teams-list.types";

type TeamCardItemProps = {
  team: TeamListItem;
};

export function TeamCardItem({ team }: TeamCardItemProps) {
  return (
    <Card className="border border-gray-100 bg-white shadow-sm">
      <CardHeader className="space-y-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50">
          <Users className="h-5 w-5 text-blue-600" />
        </div>
        <CardTitle className="text-xl">{team.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="min-h-10 text-sm leading-relaxed text-gray-600">
          {team.description || "No description available."}
        </p>
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
  );
}

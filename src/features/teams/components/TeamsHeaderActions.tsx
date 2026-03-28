import Link from "next/link";
import { DoorOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type TeamsHeaderActionsProps = {
  onOpenJoinModal: () => void;
};

export function TeamsHeaderActions({ onOpenJoinModal }: TeamsHeaderActionsProps) {
  return (
    <div className="flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Teams</h1>
        <p className="text-gray-500">Browse workspace teams and jump into their task boards.</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="outline" className="h-11 px-6 font-bold" onClick={onOpenJoinModal}>
          <DoorOpen className="mr-2 h-4 w-4" /> Join Team
        </Button>
        <Link href="/teams/create">
          <Button className="h-11 bg-blue-600 px-6 font-bold shadow-lg shadow-blue-100 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> Create Team
          </Button>
        </Link>
      </div>
    </div>
  );
}

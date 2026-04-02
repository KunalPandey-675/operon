import Link from "next/link";
import { DoorOpen, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type TeamsHeaderActionsProps = {
  onOpenJoinModal: () => void;
};

export function TeamsHeaderActions({ onOpenJoinModal }: TeamsHeaderActionsProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Teams
          </h1>
        </div>
        <p className="text-muted-foreground text-sm font-medium max-w-md">
          Collaborate with your squad, track progress, and ship products together.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          className="h-11 px-6 rounded-xl font-bold border-border/60 hover:bg-secondary/50 group" 
          onClick={onOpenJoinModal}
        >
          <DoorOpen className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" /> 
          Join Team
        </Button>
        <Link href="/teams/create">
          <Button variant="premium" className="h-11 px-6 rounded-xl font-bold group">
            <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" /> 
            Create Team
          </Button>
        </Link>
      </div>
    </div>
  );
}


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type JoinTeamSheetProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  joinCode: string;
  onJoinCodeChange: (value: string) => void;
  isJoining: boolean;
  onSubmit: () => void;
  onCancel: () => void;
};

export function JoinTeamSheet({
  open,
  onOpenChange,
  joinCode,
  onJoinCodeChange,
  isJoining,
  onSubmit,
  onCancel,
}: JoinTeamSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="space-y-6 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Join a Team</SheetTitle>
          <SheetDescription>Enter the 6-character team code shared by your manager.</SheetDescription>
        </SheetHeader>

        <div className="space-y-3">
          <label htmlFor="team-code" className="text-sm font-semibold text-gray-700">
            Team code
          </label>
          <Input
            id="team-code"
            value={joinCode}
            onChange={(e) => onJoinCodeChange(e.target.value.toUpperCase())}
            maxLength={6}
            placeholder="E.g. A1B2C3"
            className="h-11"
            disabled={isJoining}
          />
          <p className="text-xs text-gray-500">Code is not case-sensitive.</p>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={onCancel} disabled={isJoining}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isJoining}>
            {isJoining ? "Joining..." : "Join Team"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

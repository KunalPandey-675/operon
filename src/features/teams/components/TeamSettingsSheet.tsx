"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import TeamSettingsClient from "@/features/teams/components/TeamSettingsClient";

type TeamSettingsSheetProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  workspace: DbTeamWithRelations | null;
  isOwner: boolean;
};

export default function TeamSettingsSheet({ open, onOpenChange, workspace, isOwner }: TeamSettingsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto border-l border-gray-200 p-0 sm:max-w-2xl">
        <div className="flex h-full flex-col bg-gray-50/60">
          <SheetHeader className="border-b border-gray-200 bg-white px-6 py-5 text-left">
            <SheetTitle className="text-base text-gray-900">Team Settings</SheetTitle>
            <SheetDescription className="text-xs text-gray-500">Rename or delete this team without leaving the page.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <TeamSettingsClient workspace={workspace} isOwner={isOwner} surface="sheet" onSuccess={() => onOpenChange(false)} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
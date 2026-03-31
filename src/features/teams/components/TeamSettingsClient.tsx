"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, Loader2, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { deleteWorkspace, renameWorkspace } from "@/features/teams/server/workspace.mutations";

type TeamSettingsClientProps = {
  workspace: DbTeamWithRelations | null;
  isOwner: boolean;
};

export default function TeamSettingsClient({ workspace, isOwner }: TeamSettingsClientProps) {
  const router = useRouter();
  const [name, setName] = useState(workspace?.name ?? "");
  const [description, setDescription] = useState(workspace?.description ?? "");
  const [confirmName, setConfirmName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!workspace) {
    return (
      <Card className="mx-auto max-w-3xl rounded-2xl border-dashed border-gray-200 bg-gray-50/70 shadow-none">
        <CardContent className="space-y-5 px-8 py-16 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Team not found</h1>
          <p className="text-sm text-gray-600">This team may have been removed or you may not have access to it.</p>
          <div>
            <Link href="/teams">
              <Button className="rounded-xl bg-blue-600 hover:bg-blue-700">Back to Teams</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const canDelete = confirmName.trim() === workspace.name;

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isOwner) {
      toast.error("Only the team owner can rename this team");
      return;
    }

    if (!name.trim()) {
      toast.error("Team name is required");
      return;
    }

    setIsSaving(true);
    try {
      const result = await renameWorkspace({
        teamId: workspace.id,
        name,
        description,
      });

      if (!result.success) {
        toast.error(result.error || "Failed to rename team");
        return;
      }

      toast.success(result.message || "Team updated");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to rename team";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isOwner) {
      toast.error("Only the team owner can delete this team");
      return;
    }

    if (!canDelete) {
      toast.error("Type the team name to confirm deletion");
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteWorkspace({ teamId: workspace.id });

      if (!result.success) {
        toast.error(result.error || "Failed to delete team");
        return;
      }

      toast.success(result.message || "Team deleted");
      router.push("/teams");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete team";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-8">
      <Link
        href={`/teams/${workspace.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Team
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Team Settings</h1>
        <p className="text-sm text-gray-600">Rename your team or permanently delete it.</p>
      </div>

      {!isOwner ? (
        <Card className="rounded-2xl border-amber-200 bg-amber-50/80 shadow-none">
          <CardContent className="flex items-start gap-3 p-5 text-amber-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-sm font-medium">Only the team owner can change team settings.</p>
          </CardContent>
        </Card>
      ) : null}

      <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold text-gray-900">Rename Team</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleRename}>
            <div className="space-y-2">
              <label htmlFor="team-name" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Team Name
              </label>
              <Input
                id="team-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Team name"
                disabled={isSaving || !isOwner}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="team-description" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Description
              </label>
              <Textarea
                id="team-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Team description"
                className="min-h-28 resize-none"
                disabled={isSaving || !isOwner}
              />
            </div>

            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSaving || !isOwner}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-rose-200 bg-rose-50/50 shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-bold text-rose-800">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-rose-700">
            Deleting this team removes all related tasks and memberships. This action cannot be undone.
          </p>
          <div className="space-y-2">
            <label htmlFor="confirm-team-name" className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Type {workspace.name} to confirm
            </label>
            <Input
              id="confirm-team-name"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder={workspace.name}
              disabled={isDeleting || !isOwner}
              className="border-rose-200 bg-white"
            />
          </div>

          <Button
            type="button"
            variant="destructive"
            disabled={!canDelete || isDeleting || !isOwner}
            onClick={handleDelete}
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Delete Team
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

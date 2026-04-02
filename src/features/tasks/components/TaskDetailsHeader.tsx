"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type TaskDetailsHeaderProps = {
  backHref: string;
  backLabel: string;
  canEdit: boolean;
  editHref: string;
};

export default function TaskDetailsHeader({ backHref, backLabel, canEdit, editHref }: TaskDetailsHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Link href={backHref} className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <div className="flex items-center gap-2">
        {canEdit ? (
          <Link href={editHref}>
            <Button variant="outline" className="rounded-xl border-gray-200 bg-white">
              Edit Task
            </Button>
          </Link>
        ) : null}
        <Button className="rounded-xl bg-emerald-600 px-5 font-semibold text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          Mark Completed
        </Button>
      </div>
    </div>
  );
}
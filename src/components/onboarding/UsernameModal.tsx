"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  saveUsernameAction,
  type UsernameActionState,
} from "@/features/onboarding/server/onboarding.mutations";

type UsernameModalProps = {
  isOpen: boolean;
};

export default function UsernameModal({ isOpen }: UsernameModalProps) {
  const router = useRouter();
  const lastErrorRef = useRef<string | null>(null);
  const didToastSuccessRef = useRef(false);

  const [state, formAction, pending] = useActionState<UsernameActionState, FormData>(
    saveUsernameAction,
    {}
  );

  useEffect(() => {
    if (state.error && state.error !== lastErrorRef.current) {
      toast.error(state.error);
      lastErrorRef.current = state.error;
    }

    if (state.success && !didToastSuccessRef.current) {
      toast.success("Username saved successfully");
      didToastSuccessRef.current = true;
      router.refresh();
    }

    if (!state.error) {
      lastErrorRef.current = null;
    }

    if (!state.success) {
      didToastSuccessRef.current = false;
    }
  }, [router, state.error, state.success]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <section className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-gray-900">Choose your username</h2>
        <p className="mt-2 text-sm text-gray-600">
          Please set your username to continue.
        </p>

        <form action={formAction} className="mt-5 space-y-3">
          <Input
            name="username"
            placeholder="e.g. alex_m"
            minLength={2}
            maxLength={30}
            autoComplete="nickname"
            required
          />
          <p className="text-xs text-gray-500">Use letters, numbers, and underscores only.</p>

          {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Saving..." : "Save username"}
          </Button>
        </form>
      </section>
    </div>
  );
}

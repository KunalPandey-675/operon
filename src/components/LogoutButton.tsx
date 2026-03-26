"use client";

import { toast } from "sonner";

export default function LogoutButton() {
  const handleLogout = () => {
    toast.info("Signing you out...");
    window.location.assign("/auth/logout");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="button logout"
    >
      Log Out
    </button>
  );
}
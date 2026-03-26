"use client";

import { toast } from "sonner";

export default function LoginButton() {
  const handleLogin = () => {
    toast.info("Redirecting to login...");
    window.location.assign("/auth/login");
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="button login"
    >
      Log In
    </button>
  );
}
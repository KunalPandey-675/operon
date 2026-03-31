"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginButton() {
  const router = useRouter();

  const handleLogin = () => {
    toast.info("Redirecting to login...");
    router.push("/auth/login");
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
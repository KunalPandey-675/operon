"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase-client";
import type { User } from "@supabase/supabase-js";

export function LandingPageNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    getUser();
  }, [supabase]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Operon</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium hover:text-blue-600 transition-colors">Features</Link>
          <Link href="#pricing" className="text-sm font-medium hover:text-blue-600 transition-colors">Pricing</Link>
          <Link href="#solutions" className="text-sm font-medium hover:text-blue-600 transition-colors">Solutions</Link>
        </div>
        <div className="flex items-center gap-4">
          {!isLoading && user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">Open App</Button>
              </Link>
              <Link href="/auth/logout">
                <Button className="bg-blue-600 hover:bg-blue-700">Log Out</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/auth/login">
                <Button className="bg-blue-600 hover:bg-blue-700">Start Free Trial</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

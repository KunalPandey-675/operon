"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, ArrowRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase-client";
import type { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";

export function LandingPageNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md border-b shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 transition-transform group-hover:scale-110">
            <Zap className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">Operon</span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</Link>
          <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
          <Link href="#solutions" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Integrations</Link>
          <Link href="#solutions" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About</Link>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          {!isLoading && user ? (
            <>
              <Link href="/dashboard" className="hidden md:block">
                <Button variant="ghost" className="font-medium">Open Dashboard</Button>
              </Link>
              <Link href="/auth/logout">
                <Button variant="premium" className="rounded-full px-4 sm:px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md text-xs sm:text-sm h-9 sm:h-10">
                  Log Out
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hidden md:block">
                <Button variant="ghost" className="font-medium">Log In</Button>
              </Link>
              <Link href="/auth/login">
                <Button className="rounded-full px-4 sm:px-6 bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all font-semibold text-xs sm:text-sm h-9 sm:h-10">
                  <span className="hidden xs:inline">Get Started</span>
                  <span className="xs:hidden">Join</span>
                  <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </Link>
            </>
          )}
          <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}


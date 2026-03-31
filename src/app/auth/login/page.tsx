"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { loginWithEmailPassword, signUpWithEmail } from "../auth-actions";

export default function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Login state
  const [loginInput, setLoginInput] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup state
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    if (!loginInput.trim() || !loginPassword) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    const result = await loginWithEmailPassword(loginInput, loginPassword);

    if (result.error) {
      setError(result.error);
      toast.error(result.error);
    } else {
      toast.success("Login successful!");
      router.push("/dashboard");
    }

    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    // Validation
    if (!signupUsername.trim() || !signupEmail.trim() || !signupPassword) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (signupPassword.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)) {
      setError("Please enter a valid email");
      setIsLoading(false);
      return;
    }

    const result = await signUpWithEmail(signupEmail, signupPassword, signupUsername);

    if (result.error) {
      setError(result.error);
      toast.error(result.error);
    } else {
      setSuccess(true);
      toast.success("Account created! Check your email to verify.");
      // Clear form
      setSignupUsername("");
      setSignupEmail("");
      setSignupPassword("");
      setSignupConfirmPassword("");
    }

    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-12">
      <section className="w-full max-w-md">
        <div className="rounded-2xl border bg-white p-8 shadow-xl shadow-blue-100/50">
          {/* Header */}
          <div className="mb-6 flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Operon</span>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-1 mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
                <p className="text-sm text-gray-600">Sign in with your username or email</p>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-700 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Username or Email
                  </label>
                  <Input
                    type="text"
                    placeholder="john_doe or john@example.com"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    disabled={isLoading}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={isLoading}
                    className="h-10"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 h-10"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="text-center">
                <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                  Back to home
                </Link>
              </div>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-1 mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Create account</h2>
                <p className="text-sm text-gray-600">Join Operon and start collaborating</p>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-700 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="rounded-lg bg-green-50 border border-green-200 p-3 flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Account created!</p>
                    <p className="text-xs text-green-700 mt-1">
                      Check your email to verify your account
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Username
                  </label>
                  <Input
                    type="text"
                    placeholder="john_doe"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    disabled={isLoading || success}
                    className="h-10"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    2-30 characters, letters/numbers/underscore/hyphen only
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    disabled={isLoading || success}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    disabled={isLoading || success}
                    className="h-10"
                  />
                  <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    disabled={isLoading || success}
                    className="h-10"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || success}
                  className="w-full bg-blue-600 hover:bg-blue-700 h-10"
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>

              <div className="text-center">
                <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                  Back to home
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </section>
    </main>
  );
}

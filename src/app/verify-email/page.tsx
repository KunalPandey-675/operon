import Link from "next/link";
import { MailCheck, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <section className="w-full max-w-xl rounded-2xl border bg-white p-8 shadow-xl shadow-blue-100/50">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
          <MailCheck className="h-6 w-6" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Verify your email to continue</h1>
        <p className="mt-3 text-gray-600 leading-relaxed">
          We sent a verification link to your sign-up email address. Please open that email and click
          the link to activate your account.
        </p>
        <p className="mt-2 text-gray-600 leading-relaxed">
          After verification, continue below. We will create your Operon profile in Supabase only after
          your email is verified.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/auth/login" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <RefreshCcw className="mr-2 h-4 w-4" />
              I verified, continue
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              Back to home
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}

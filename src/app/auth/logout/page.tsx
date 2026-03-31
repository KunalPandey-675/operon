import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { LogOut, Zap } from "lucide-react";

export default function LogoutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <section className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-xl shadow-blue-100/50">
        <div className="mb-6 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Operon</span>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Ready to go?</h2>
          <p className="text-gray-600">Sign out of your account</p>

          <form
            action={async () => {
              "use server";
              await signOut();
            }}
            className="pt-4"
          >
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 h-10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </form>

          <div className="pt-4">
            <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
              Never mind, stay logged in
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

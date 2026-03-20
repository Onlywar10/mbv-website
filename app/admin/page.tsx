import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/require-auth";
import { logoutAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboard() {
  const user = await requireAuth();

  return (
    <div className="min-h-screen bg-stone">
      <header className="border-b border-border bg-cream">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-lg uppercase tracking-wide text-primary">
            MBV Admin
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user.email}
            </span>
            <form action={logoutAction}>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="font-heading uppercase"
              >
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl uppercase tracking-tight text-primary">
          Welcome, {user.name}
        </h2>
        <p className="mt-2 text-muted-foreground">
          Admin dashboard — features coming soon.
        </p>
      </main>
    </div>
  );
}

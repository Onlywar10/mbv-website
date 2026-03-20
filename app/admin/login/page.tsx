import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { validateSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  // Redirect if already logged in
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    const user = await validateSession(token);
    if (user) redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl uppercase tracking-tight text-primary">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Monterey Bay Veterans Administration
          </p>
        </div>

        <div className="rounded-sm bg-cream p-8 shadow-sharp ring-1 ring-border">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

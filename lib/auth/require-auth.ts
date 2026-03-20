import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { validateSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const user = await validateSession(token);
  if (!user) {
    cookieStore.delete(SESSION_COOKIE_NAME);
    redirect("/admin/login");
  }

  return user;
}

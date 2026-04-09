"use server";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { verifyPassword } from "@/lib/auth/password";
import {
	createSession,
	deleteSession,
	SESSION_COOKIE_NAME,
	SESSION_DURATION_SECONDS,
} from "@/lib/auth/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/users";

const loginSchema = z.object({
	username: z.string().min(1, "Username is required"),
	password: z.string().min(1, "Password is required"),
});

export type LoginState = {
	error?: string;
};

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
	const parsed = loginSchema.safeParse({
		username: formData.get("username"),
		password: formData.get("password"),
	});

	if (!parsed.success) {
		return { error: parsed.error.issues[0].message };
	}

	const { username, password } = parsed.data;

	const result = await db
		.select()
		.from(users)
		.where(eq(users.email, username.toLowerCase()))
		.limit(1);

	const user = result[0];

	if (!user || !user.isActive) {
		return { error: "Invalid username or password" };
	}

	const valid = await verifyPassword(password, user.passwordHash);
	if (!valid) {
		return { error: "Invalid username or password" };
	}

	const token = await createSession(user.id);

	const cookieStore = await cookies();
	cookieStore.set(SESSION_COOKIE_NAME, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: SESSION_DURATION_SECONDS,
		path: "/",
	});

	redirect("/admin");
}

export async function logoutAction(): Promise<void> {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

	if (token) {
		await deleteSession(token);
		cookieStore.delete(SESSION_COOKIE_NAME);
	}

	redirect("/admin/login");
}

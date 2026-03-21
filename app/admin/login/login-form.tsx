"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type LoginState, loginAction } from "@/lib/auth/actions";

const initialState: LoginState = {};

export function LoginForm() {
	const [state, formAction, isPending] = useActionState(loginAction, initialState);

	return (
		<form action={formAction} className="space-y-5">
			{state.error && (
				<div className="rounded-sm bg-rust/10 px-4 py-3 text-sm text-rust">{state.error}</div>
			)}

			<div className="space-y-2">
				<Label htmlFor="email" className="font-heading uppercase text-xs tracking-wider">
					Email
				</Label>
				<Input
					id="email"
					name="email"
					type="email"
					autoComplete="email"
					required
					placeholder="admin@mbv.org"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="password" className="font-heading uppercase text-xs tracking-wider">
					Password
				</Label>
				<Input
					id="password"
					name="password"
					type="password"
					autoComplete="current-password"
					required
					placeholder="Enter your password"
				/>
			</div>

			<Button
				type="submit"
				disabled={isPending}
				className="w-full bg-rust font-heading uppercase text-cream hover:bg-rust-light"
			>
				{isPending ? "Signing in..." : "Sign In"}
			</Button>
		</form>
	);
}

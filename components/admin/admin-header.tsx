"use client";

import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/auth/actions";
import { AdminSidebar } from "./admin-sidebar";

interface AdminHeaderProps {
	userEmail: string;
}

export function AdminHeader({ userEmail }: AdminHeaderProps) {
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<>
			<header className="flex h-14 items-center justify-between border-b border-border bg-cream px-4 lg:px-6">
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={() => setMobileOpen(!mobileOpen)}
						className="flex h-9 w-9 items-center justify-center rounded-sm text-foreground hover:bg-muted lg:hidden"
						aria-label="Toggle menu"
					>
						{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
					</button>
					<span className="font-heading text-lg uppercase tracking-wide text-primary">
						MBV Admin
					</span>
				</div>
				<div className="flex items-center gap-4">
					<span className="hidden text-sm text-muted-foreground sm:block">{userEmail}</span>
					<form action={logoutAction}>
						<Button
							type="submit"
							variant="ghost"
							size="sm"
							className="gap-2 font-heading uppercase text-muted-foreground hover:text-primary"
						>
							<LogOut className="h-4 w-4" />
							<span className="hidden sm:inline">Sign Out</span>
						</Button>
					</form>
				</div>
			</header>

			{/* Mobile sidebar overlay */}
			{mobileOpen && (
				<div className="fixed inset-0 z-40 lg:hidden">
					<div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
					<div className="absolute left-0 top-14 h-[calc(100%-3.5rem)] w-64 bg-cream shadow-sharp">
						<AdminSidebar />
					</div>
				</div>
			)}
		</>
	);
}

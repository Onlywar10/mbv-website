"use client";

import {
	Calendar,
	Crown,
	DollarSign,
	ImageIcon,
	LayoutDashboard,
	Settings,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
	{ href: "/admin", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/admin/events", label: "Events", icon: Calendar },
	{ href: "/admin/clients", label: "Clients", icon: Users },
	{ href: "/admin/donations", label: "Donations", icon: DollarSign },
	{ href: "/admin/members", label: "Members", icon: Crown },
	{ href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
	{ href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
	const pathname = usePathname();

	return (
		<nav className="flex flex-col gap-1 p-4">
			{navItems.map((item) => {
				const Icon = item.icon;
				const isActive =
					item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

				return (
					<Link
						key={item.href}
						href={item.href}
						className={cn(
							"flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-heading uppercase tracking-wide transition-colors",
							isActive
								? "bg-rust/10 text-rust"
								: "text-muted-foreground hover:bg-muted hover:text-primary",
						)}
					>
						<Icon className="h-5 w-5" />
						{item.label}
					</Link>
				);
			})}
		</nav>
	);
}

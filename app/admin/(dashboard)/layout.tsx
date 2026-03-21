import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAuth } from "@/lib/auth/require-auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const user = await requireAuth();

	return (
		<div className="flex min-h-screen flex-col bg-stone">
			<AdminHeader userEmail={user.email} />
			<div className="flex flex-1">
				{/* Desktop sidebar */}
				<aside className="hidden w-64 shrink-0 border-r border-border bg-cream lg:block">
					<AdminSidebar />
				</aside>
				{/* Main content */}
				<main className="flex-1 p-6 lg:p-8">{children}</main>
			</div>
		</div>
	);
}

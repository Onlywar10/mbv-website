import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Settings",
	robots: { index: false, follow: false },
};

export default function SettingsPage() {
	return (
		<div>
			<h1 className="font-heading text-2xl uppercase tracking-tight text-primary">Settings</h1>
			<p className="mt-1 text-sm text-muted-foreground">System configuration and testing</p>
		</div>
	);
}

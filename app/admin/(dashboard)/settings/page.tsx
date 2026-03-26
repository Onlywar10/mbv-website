import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SendRemindersButton } from "./send-reminders-button";
import { SendReportButton } from "./send-report-button";

export const metadata: Metadata = {
	title: "Settings",
	robots: { index: false, follow: false },
};

export default function SettingsPage() {
	return (
		<div>
			<h1 className="font-heading text-2xl uppercase tracking-tight text-primary">Settings</h1>
			<p className="mt-1 text-sm text-muted-foreground">System configuration and testing</p>

			<Card className="mt-8">
				<CardHeader>
					<CardTitle className="font-heading text-sm uppercase tracking-wider text-muted-foreground">
						Email Reports
					</CardTitle>
					<CardDescription>
						Send the daily registration report manually. This emails all active admins a summary of
						yesterday&apos;s event registrations.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<SendReportButton />
				</CardContent>
			</Card>
			<Card className="mt-6">
				<CardHeader>
					<CardTitle className="font-heading text-sm uppercase tracking-wider text-muted-foreground">
						Membership Reminders
					</CardTitle>
					<CardDescription>
						Send expiration reminders to members whose annual membership expires within the next 30
						days.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<SendRemindersButton />
				</CardContent>
			</Card>
		</div>
	);
}

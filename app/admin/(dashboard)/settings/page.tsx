import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getGivebutterCampaignCodes, getNotificationSettings, getSmartWaiverSettings } from "@/lib/queries/settings";
import { CampaignCodesForm } from "./campaign-codes-form";
import { NotificationRoutingForm } from "./notification-routing-form";
import { SendReportButton } from "./send-report-button";
import { SmartWaiverForm } from "./smartwaiver-form";

export const metadata: Metadata = {
	title: "Settings",
	robots: { index: false, follow: false },
};

export default async function SettingsPage() {
	const [campaignCodes, notificationSettings, smartWaiverSettings] = await Promise.all([
		getGivebutterCampaignCodes(),
		getNotificationSettings(),
		getSmartWaiverSettings(),
	]);

	return (
		<div>
			<h1 className="font-heading text-2xl uppercase tracking-tight text-primary">Settings</h1>
			<p className="mt-1 text-sm text-muted-foreground">System configuration and testing</p>

			<Card className="mt-8">
				<CardHeader>
					<CardTitle className="font-heading text-sm uppercase tracking-wider text-muted-foreground">
						Notification Routing
					</CardTitle>
					<CardDescription>
						Configure which email addresses receive notifications for different categories. Leave
						blank to send to all active admin users.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<NotificationRoutingForm
						contactEmails={notificationSettings.contact}
						eventEmails={notificationSettings.events}
						membershipDonationEmails={notificationSettings.membershipDonation}
					/>
				</CardContent>
			</Card>

			<Card className="mt-6">
				<CardHeader>
					<CardTitle className="font-heading text-sm uppercase tracking-wider text-muted-foreground">
						GiveButter Campaign Codes
					</CardTitle>
					<CardDescription>
						Configure which GiveButter campaigns map to membership tiers. Only transactions from
						these campaigns will create memberships.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<CampaignCodesForm
						annualCode={campaignCodes.annual ?? ""}
						lifetimeCode={campaignCodes.lifetime ?? ""}
					/>
				</CardContent>
			</Card>

			<Card className="mt-6">
				<CardHeader>
					<CardTitle className="font-heading text-sm uppercase tracking-wider text-muted-foreground">
						SmartWaiver Integration
					</CardTitle>
					<CardDescription>
						Configure SmartWaiver for event liability waivers. Events with waivers enabled will
						show the signing widget and track completion status.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<SmartWaiverForm
						waiverUrl={smartWaiverSettings.waiverUrl ?? ""}
					/>
				</CardContent>
			</Card>

			<Card className="mt-6">
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
		</div>
	);
}

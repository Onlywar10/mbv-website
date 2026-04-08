import { Mail } from "lucide-react";
import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getMailingListClients } from "@/lib/queries/email";
import { ComposeForm } from "./compose-form";

export const metadata: Metadata = {
	title: "Mailing List",
	robots: { index: false, follow: false },
};

export default async function MailingListPage() {
	const recipients = await getMailingListClients();

	return (
		<div>
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-heading text-2xl uppercase tracking-tight text-primary">
						Mailing List
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">Send emails to opted-in clients</p>
				</div>
				<div className="flex items-center gap-2 rounded-sm bg-cream px-4 py-2 ring-1 ring-border">
					<Mail className="h-4 w-4 text-rust" />
					<span className="font-heading text-sm uppercase tracking-wider text-primary">
						{recipients.length} recipient{recipients.length !== 1 ? "s" : ""}
					</span>
				</div>
			</div>

			<Card className="mt-8 rounded-sm ring-1 ring-border shadow-sharp">
				<CardHeader>
					<CardTitle className="font-heading text-sm uppercase tracking-wider text-muted-foreground">
						Compose Email
					</CardTitle>
					<CardDescription>
						Write and send an email to all clients who have opted in to communications. Attachments
						are uploaded to cloud storage and linked in the email.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ComposeForm recipientCount={recipients.length} />
				</CardContent>
			</Card>
		</div>
	);
}

"use server";

import { requireAuth } from "@/lib/auth/require-auth";
import { sendMailingListEmail } from "@/lib/email";
import { getMailingListClients } from "@/lib/queries/email";
import type { ActionState } from "@/lib/types";
import { mailingListSchema } from "@/lib/validations/mailing-list";

export async function sendMailingListBlastAction(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireAuth();

	const parsed = mailingListSchema.safeParse(Object.fromEntries(formData));
	if (!parsed.success) {
		return { error: parsed.error.issues[0].message };
	}

	const { subject, body, attachmentUrls, attachmentNames } = parsed.data;

	const recipients = await getMailingListClients();

	if (recipients.length === 0) {
		return { error: "No opt-in clients found to send to." };
	}

	// Parse attachments from comma-separated URLs and names
	const attachments: { filename: string; path: string }[] = [];
	if (attachmentUrls) {
		const urls = attachmentUrls.split(",").filter(Boolean);
		const names = (attachmentNames || "").split(",").filter(Boolean);
		for (let i = 0; i < urls.length; i++) {
			attachments.push({
				path: urls[i],
				filename: names[i] || `attachment-${i + 1}`,
			});
		}
	}

	// Convert plain text body to HTML paragraphs
	const htmlBody = body
		.split("\n\n")
		.map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`)
		.join("");

	let sent = 0;
	const errors: string[] = [];

	// Batch sends in groups of 10 with delays for rate limiting
	const batchSize = 10;
	for (let i = 0; i < recipients.length; i += batchSize) {
		const batch = recipients.slice(i, i + batchSize);

		await Promise.allSettled(
			batch.map(async (r) => {
				try {
					await sendMailingListEmail({
						to: r.email,
						firstName: r.firstName,
						subject,
						body: htmlBody,
						attachments: attachments.length > 0 ? attachments : undefined,
					});
					sent++;
				} catch (err) {
					errors.push(r.email);
					console.error(`Failed to send to ${r.email}:`, err);
				}
			}),
		);

		// Rate limit: wait 1 second between batches
		if (i + batchSize < recipients.length) {
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}

	if (errors.length > 0) {
		return {
			success: `Sent to ${sent} of ${recipients.length} recipients. ${errors.length} failed.`,
		};
	}

	return {
		success: `Email sent to ${sent} recipient${sent !== 1 ? "s" : ""}.`,
	};
}

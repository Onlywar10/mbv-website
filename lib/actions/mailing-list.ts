"use server";

import { del } from "@vercel/blob";
import { requireAuth } from "@/lib/auth/require-auth";
import { sendMailingListEmail } from "@/lib/email";
import { logger } from "@/lib/logger";
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

	const { subject, body, attachmentUrls, attachmentNames, imageUrls, imageNames } = parsed.data;

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

	// Parse embedded images from comma-separated URLs and names
	const embeddedImages: { url: string; name: string }[] = [];
	if (imageUrls) {
		const urls = imageUrls.split(",").filter(Boolean);
		const names = (imageNames || "").split(",").filter(Boolean);
		for (let i = 0; i < urls.length; i++) {
			embeddedImages.push({
				url: urls[i],
				name: names[i] || `image-${i + 1}`,
			});
		}
	}

	// Convert plain text body to HTML paragraphs
	const paragraphs = body
		.split("\n\n")
		.map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`)
		.join("");

	// Append embedded images as inline <img> tags
	const imageHtml = embeddedImages
		.map(
			(img) =>
				`<div style="margin: 16px 0;"><img src="${img.url}" alt="${img.name}" style="max-width: 100%; height: auto; border-radius: 4px;" /></div>`,
		)
		.join("");

	const htmlBody = paragraphs + imageHtml;

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
					logger.error("mailing-list", "Failed to send blast email", { to: r.email, error: String(err) });
				}
			}),
		);

		// Rate limit: wait 1 second between batches
		if (i + batchSize < recipients.length) {
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}

	// Clean up attachment blobs — Resend fetches the file at send time,
	// so the blob is no longer needed. Embedded images stay alive since
	// they're referenced as <img src> in recipients' inboxes.
	if (attachments.length > 0) {
		const attachmentBlobUrls = attachments.map((a) => a.path);
		del(attachmentBlobUrls).catch((err) => logger.warn("mailing-list", "Failed to clean up attachment blobs", { error: String(err) }));
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

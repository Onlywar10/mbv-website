import { emailLayout } from "../layout";
import { sendEmail } from "../send";

// ---------------------------------------------------------------------------
// Mailing List Blast
// ---------------------------------------------------------------------------

interface MailingListParams {
	to: string;
	firstName: string;
	subject: string;
	body: string;
	attachments?: { filename: string; path: string }[];
}

export async function sendMailingListEmail(
	params: MailingListParams,
): Promise<void> {
	const content = `
		<p>Hi ${params.firstName},</p>
		${params.body}`;

	await sendEmail({
		to: params.to,
		subject: params.subject,
		html: emailLayout({
			body: content,
			disclaimer:
				"You received this email because you opted in to communications from Monterey Bay Veterans. To unsubscribe, please contact us at Info@mbv.org.",
		}),
		attachments: params.attachments,
	});
}

import { emailLayout } from "../layout";
import { sendEmail } from "../send";
import { buildUnsubscribeUrl } from "../unsubscribe";

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

export async function sendMailingListEmail(params: MailingListParams): Promise<void> {
	const unsubscribeUrl = buildUnsubscribeUrl(params.to);

	const content = `
		<p>Hi ${params.firstName},</p>
		${params.body}`;

	await sendEmail({
		to: params.to,
		subject: params.subject,
		html: emailLayout({
			body: content,
			disclaimer: `You received this email because you opted in to communications from Monterey Bay Veterans. <a href="${unsubscribeUrl}" style="color: #c0392b;">Unsubscribe</a>`,
		}),
		attachments: params.attachments,
	});
}

import { EMAIL_FROM, resend } from "./client";

/** Send an email via Resend. Centralizes the API call for consistent error handling. */
export async function sendEmail(params: {
	to: string | string[];
	subject: string;
	html: string;
	replyTo?: string;
	attachments?: { filename: string; path: string }[];
}): Promise<void> {
	await resend.emails.send({
		from: EMAIL_FROM,
		to: Array.isArray(params.to) ? params.to : [params.to],
		subject: params.subject,
		html: params.html,
		...(params.replyTo && { replyTo: params.replyTo }),
		...(params.attachments && { attachments: params.attachments }),
	});
}

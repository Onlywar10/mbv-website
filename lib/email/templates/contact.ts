import { emailLayout } from "../layout";
import { sendEmail } from "../send";

// ---------------------------------------------------------------------------
// Contact Form Notification (sent to admins)
// ---------------------------------------------------------------------------

interface ContactNotificationParams {
	adminEmails: string[];
	senderName: string;
	senderEmail: string;
	senderPhone?: string;
	subject: string;
	message: string;
}

export async function sendContactNotification(
	params: ContactNotificationParams,
): Promise<void> {
	const phoneLine = params.senderPhone
		? `<p style="margin: 2px 0; color: #4a5568;"><strong>Phone:</strong> ${params.senderPhone}</p>`
		: "";

	const body = `
		<h2 style="font-size: 18px; margin-bottom: 4px;">New Contact Form Submission</h2>
		<div style="background: #f7fafc; border-left: 4px solid #c0392b; padding: 12px 16px; margin: 16px 0;">
			<p style="margin: 0; font-weight: bold; font-size: 16px;">${params.subject}</p>
			<p style="margin: 2px 0; color: #4a5568;"><strong>From:</strong> ${params.senderName} (${params.senderEmail})</p>
			${phoneLine}
		</div>
		<div style="background: #f7fafc; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
			<p style="margin: 0; white-space: pre-wrap;">${params.message}</p>
		</div>`;

	await sendEmail({
		to: params.adminEmails,
		subject: `Contact Form: ${params.subject}`,
		replyTo: params.senderEmail,
		html: emailLayout({
			body,
			showSignature: false,
			disclaimer:
				"This message was sent via the contact form on the Monterey Bay Veterans website.",
		}),
	});
}

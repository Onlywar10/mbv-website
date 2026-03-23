import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_FROM = process.env.EMAIL_FROM || "Monterey Bay Veterans <onboarding@resend.dev>";

export async function sendRegistrationConfirmation({
	to,
	firstName,
	role,
	eventTitle,
	eventDate,
	eventTime,
	eventLocation,
}: {
	to: string;
	firstName: string;
	role: "participant" | "volunteer";
	eventTitle: string;
	eventDate: string;
	eventTime: string | null;
	eventLocation: string | null;
}) {
	const roleLabel = role === "volunteer" ? "volunteer" : "participant";
	const dateFormatted = new Date(`${eventDate}T00:00:00`).toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	await resend.emails.send({
		from: EMAIL_FROM,
		to: [to],
		subject: `Registration Received — ${eventTitle}`,
		html: `
			<div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #1a202c;">
				<h1 style="color: #1a365d; font-size: 24px; margin-bottom: 4px;">Monterey Bay Veterans</h1>
				<hr style="border: none; border-top: 2px solid #c0392b; margin: 16px 0;" />

				<p>Hi ${firstName},</p>

				<p>Thank you for signing up as a <strong>${roleLabel}</strong> for:</p>

				<div style="background: #f7fafc; border-left: 4px solid #c0392b; padding: 12px 16px; margin: 16px 0;">
					<p style="margin: 0; font-weight: bold; font-size: 18px;">${eventTitle}</p>
					<p style="margin: 4px 0 0; color: #4a5568;">${dateFormatted}${eventTime ? ` at ${eventTime}` : ""}</p>
					${eventLocation ? `<p style="margin: 4px 0 0; color: #4a5568;">${eventLocation}</p>` : ""}
				</div>

				<p>Your registration has been received and is <strong>pending review</strong>. You should expect to hear back from us soon with full confirmation details.</p>

				<p>If you have any questions in the meantime, feel free to reach out to us.</p>

				<p style="margin-top: 24px;">— The Monterey Bay Veterans Team</p>

				<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
				<p style="color: #a0aec0; font-size: 12px;">You received this email because you signed up for an event at Monterey Bay Veterans.</p>
			</div>
		`,
	});
}

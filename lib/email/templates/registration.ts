import { eventDetailCard, formatEventDate, reasonBlock } from "../format";
import { emailLayout } from "../layout";
import { sendEmail } from "../send";

// ---------------------------------------------------------------------------
// Registration Confirmation
// ---------------------------------------------------------------------------

interface RegistrationConfirmationParams {
	to: string;
	firstName: string;
	role: "participant" | "volunteer";
	eventTitle: string;
	eventDate: string;
	eventTime: string | null;
	eventLocation: string | null;
}

export async function sendRegistrationConfirmation(
	params: RegistrationConfirmationParams,
): Promise<void> {
	const roleLabel = params.role === "volunteer" ? "volunteer" : "participant";

	const body = `
		<p>Hi ${params.firstName},</p>
		<p>Thank you for signing up as a <strong>${roleLabel}</strong> for:</p>
		${eventDetailCard({ title: params.eventTitle, date: params.eventDate, time: params.eventTime, location: params.eventLocation })}
		<p>Your registration has been received and is <strong>pending review</strong>. You should expect to hear back from us soon with full confirmation details.</p>
		<p>If you have any questions in the meantime, feel free to reach out to us.</p>`;

	await sendEmail({
		to: params.to,
		subject: `Registration Received — ${params.eventTitle}`,
		html: emailLayout({
			body,
			disclaimer:
				"You received this email because you signed up for an event at Monterey Bay Veterans.",
		}),
	});
}

// ---------------------------------------------------------------------------
// Registration Status Update (Approved / Denied)
// ---------------------------------------------------------------------------

interface StatusUpdateParams {
	to: string;
	firstName: string;
	role: string;
	status: "registered" | "cancelled";
	eventTitle: string;
	eventDate: string;
	eventTime: string | null;
	eventLocation: string | null;
	reason?: string;
	waiverUrl?: string;
}

export async function sendStatusUpdateEmail(
	params: StatusUpdateParams,
): Promise<void> {
	const approved = params.status === "registered";
	const roleLabel = params.role === "volunteer" ? "volunteer" : "participant";

	const subject = approved
		? `You're Confirmed — ${params.eventTitle}`
		: `Registration Update — ${params.eventTitle}`;

	const message = approved
		? `<p>Great news! Your registration as a <strong>${roleLabel}</strong> has been <strong style="color: #276749;">approved</strong>.</p>
			<p>We look forward to seeing you there!</p>`
		: `<p>Unfortunately, your registration as a <strong>${roleLabel}</strong> was <strong style="color: #c0392b;">not approved</strong> at this time.</p>
			${reasonBlock(params.reason)}
			<p>If you have any questions, please don't hesitate to reach out to us.</p>`;

	const eventCard = approved
		? eventDetailCard({
				title: params.eventTitle,
				date: params.eventDate,
				time: params.eventTime,
				location: params.eventLocation,
				borderColor: "#276749",
			})
		: "";

	const waiverBlock = approved && params.waiverUrl
		? `<div style="background: #fffbeb; border-left: 4px solid #d97706; padding: 12px 16px; margin: 16px 0;">
			<p style="margin: 0; font-weight: bold; font-size: 14px;">Waiver Required</p>
			<p style="margin: 4px 0 0; color: #4a5568;">Please sign our liability waiver before attending the event:</p>
			<p style="margin: 8px 0 0;"><a href="${params.waiverUrl}" style="color: #c0392b; font-weight: bold;">Sign the Waiver</a></p>
		</div>`
		: "";

	const body = `
		<p>Hi ${params.firstName},</p>
		${message}
		${eventCard}
		${waiverBlock}`;

	await sendEmail({
		to: params.to,
		subject,
		html: emailLayout({
			body,
			disclaimer:
				"You received this email because you signed up for an event at Monterey Bay Veterans.",
		}),
	});
}

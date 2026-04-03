import { eventDetailCard, reasonBlock } from "../format";
import { emailLayout } from "../layout";
import { sendEmail } from "../send";

// ---------------------------------------------------------------------------
// Event Cancellation
// ---------------------------------------------------------------------------

interface EventCancellationParams {
	to: string;
	firstName: string;
	eventTitle: string;
	eventDate: string;
	reason?: string;
}

export async function sendEventCancellationEmail(
	params: EventCancellationParams,
): Promise<void> {
	const body = `
		<p>Hi ${params.firstName},</p>
		<p>We regret to inform you that the following event has been <strong style="color: #c0392b;">cancelled</strong>:</p>
		${eventDetailCard({ title: params.eventTitle, date: params.eventDate })}
		${reasonBlock(params.reason)}
		<p>We apologize for any inconvenience. Please check our events page for upcoming opportunities.</p>`;

	await sendEmail({
		to: params.to,
		subject: `Event Cancelled — ${params.eventTitle}`,
		html: emailLayout({
			body,
			disclaimer:
				"You received this email because you were registered for an event at Monterey Bay Veterans.",
		}),
	});
}

// ---------------------------------------------------------------------------
// Event Reminder (2 days before)
// ---------------------------------------------------------------------------

interface EventReminderParams {
	to: string;
	firstName: string;
	role: string;
	eventTitle: string;
	eventDate: string;
	eventTime: string | null;
	eventLocation: string | null;
	waiverUrl?: string;
}

export async function sendEventReminderEmail(
	params: EventReminderParams,
): Promise<void> {
	const roleLabel = params.role === "volunteer" ? "volunteer" : "participant";

	const waiverBlock = params.waiverUrl
		? `<div style="background: #fffbeb; border-left: 4px solid #d97706; padding: 12px 16px; margin: 16px 0;">
			<p style="margin: 0; font-weight: bold; font-size: 14px;">Waiver Required</p>
			<p style="margin: 4px 0 0; color: #4a5568;">Please sign our liability waiver before attending the event:</p>
			<p style="margin: 8px 0 0;"><a href="${params.waiverUrl}" style="color: #c0392b; font-weight: bold;">Sign the Waiver</a></p>
		</div>`
		: "";

	const body = `
		<p>Hi ${params.firstName},</p>
		<p>Just a friendly reminder that you're signed up as a <strong>${roleLabel}</strong> for an upcoming event:</p>
		${eventDetailCard({ title: params.eventTitle, date: params.eventDate, time: params.eventTime, location: params.eventLocation, borderColor: "#276749" })}
		${waiverBlock}
		<p>We look forward to seeing you there!</p>
		<p>If you have any questions or need to cancel, please reach out to us.</p>`;

	await sendEmail({
		to: params.to,
		subject: `Reminder: ${params.eventTitle} is Coming Up!`,
		html: emailLayout({
			body,
			disclaimer:
				"You received this email because you are registered for an upcoming event at Monterey Bay Veterans.",
		}),
	});
}

// ---------------------------------------------------------------------------
// Post-Event Volunteer Thank You
// ---------------------------------------------------------------------------

interface PostEventThanksParams {
	to: string;
	firstName: string;
	eventTitle: string;
	eventDate: string;
}

export async function sendPostEventThanksEmail(
	params: PostEventThanksParams,
): Promise<void> {
	const body = `
		<p>Hi ${params.firstName},</p>
		<p>Thank you so much for volunteering at <strong>${params.eventTitle}</strong>! Your time and dedication make a real difference in the lives of our veterans.</p>
		<p>We truly couldn't do this without volunteers like you. We hope to see you at future events!</p>`;

	await sendEmail({
		to: params.to,
		subject: `Thank You for Volunteering — ${params.eventTitle}`,
		html: emailLayout({
			body,
			disclaimer:
				"You received this email because you volunteered for an event at Monterey Bay Veterans.",
		}),
	});
}

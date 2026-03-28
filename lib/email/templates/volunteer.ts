import { eventDetailCard } from "../format";
import { emailLayout } from "../layout";
import { sendEmail } from "../send";

// ---------------------------------------------------------------------------
// Volunteer Recruitment Blast
// ---------------------------------------------------------------------------

interface VolunteerRecruitmentParams {
	to: string;
	firstName: string;
	eventTitle: string;
	eventDate: string;
	eventTime: string | null;
	eventLocation: string | null;
	personalMessage?: string;
}

export async function sendVolunteerRecruitmentEmail(
	params: VolunteerRecruitmentParams,
): Promise<void> {
	const messageBlock = params.personalMessage
		? `<div style="background: #f7fafc; padding: 12px 16px; margin: 16px 0; border-radius: 4px; font-style: italic;">
				<p style="margin: 0;">"${params.personalMessage}"</p>
			</div>`
		: "";

	const body = `
		<p>Hi ${params.firstName},</p>
		<p>We need your help! An upcoming event is looking for <strong>volunteers</strong>, and we thought of you based on your past support:</p>
		${eventDetailCard({ title: params.eventTitle, date: params.eventDate, time: params.eventTime, location: params.eventLocation })}
		${messageBlock}
		<p>If you're available and interested, please visit our website to sign up. Every volunteer makes a difference!</p>`;

	await sendEmail({
		to: params.to,
		subject: `Volunteers Needed — ${params.eventTitle}`,
		html: emailLayout({
			body,
			disclaimer:
				"You received this email because you previously volunteered with Monterey Bay Veterans.",
		}),
	});
}

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
	volunteerUrl: string;
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
		<p>If you're available and interested, every volunteer makes a difference!</p>
		<div style="margin: 20px 0;">
			<a href="${params.volunteerUrl}" style="display: inline-block; background: #c0392b; color: #ffffff; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold;">Sign Up to Volunteer</a>
		</div>`;

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

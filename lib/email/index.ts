// Re-export all email functions for backwards compatibility.
// Callers can import from "@/lib/email" and get the same functions as before.

export {
	sendAdminDonationNotification,
	sendAdminMembershipNotification,
} from "./templates/admin-notify";
export { sendContactNotification } from "./templates/contact";
export { sendDonationThankYouEmail } from "./templates/donation";
export {
	sendEventCancellationEmail,
	sendEventReminderEmail,
	sendPostEventThanksEmail,
} from "./templates/event";
export { sendMailingListEmail } from "./templates/mailing-list";
export {
	sendMembershipConfirmationEmail,
	sendMembershipExpiredEmail,
} from "./templates/membership";
export { sendRegistrationConfirmation, sendStatusUpdateEmail } from "./templates/registration";
export type { ReportEvent } from "./templates/report";
export { sendDailyRegistrationReport } from "./templates/report";
export { sendVolunteerRecruitmentEmail } from "./templates/volunteer";

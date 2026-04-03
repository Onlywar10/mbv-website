// Re-export all email functions for backwards compatibility.
// Callers can import from "@/lib/email" and get the same functions as before.

export { sendRegistrationConfirmation, sendStatusUpdateEmail } from "./templates/registration";
export { sendEventCancellationEmail, sendEventReminderEmail, sendPostEventThanksEmail } from "./templates/event";
export { sendMembershipConfirmationEmail, sendMembershipExpiredEmail } from "./templates/membership";
export { sendDailyRegistrationReport } from "./templates/report";
export { sendDonationThankYouEmail } from "./templates/donation";
export { sendContactNotification } from "./templates/contact";
export { sendVolunteerRecruitmentEmail } from "./templates/volunteer";
export { sendMailingListEmail } from "./templates/mailing-list";
export { sendAdminDonationNotification, sendAdminMembershipNotification } from "./templates/admin-notify";

export type { ReportEvent } from "./templates/report";

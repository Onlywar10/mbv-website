export type ActionState = {
	error?: string;
	success?: string;
};

export type PublicEvent = {
	id: string;
	slug: string;
	title: string;
	date: string;
	time: string | null;
	location: string | null;
	category: "fishing" | "whale-watching" | "volunteer" | "community" | "derby";
	description: string | null;
	longDescription: string | null;
	imageUrl: string | null;
	accessibility: string | null;
	participantCapacity: number;
	volunteerCapacity: number;
	volunteerEnabled: boolean;
	volunteerDescription: string | null;
	volunteerTime: string | null;
	volunteerNotes: string | null;
};

export type RegistrationRow = {
	id: string;
	clientId: string;
	firstName: string;
	lastName: string;
	email: string;
	status: "registered" | "waitlisted" | "attended" | "cancelled";
	guestCount: number;
	registeredAt: Date;
	notes: string | null;
};

export type DonationRow = {
	id: string;
	clientId: string | null;
	firstName: string | null;
	lastName: string | null;
	amount: string;
	paymentMethod: "venmo" | "paypal" | "check" | "cash" | "card" | "other";
	transactionId: string | null;
	donatedAt: Date;
	notes: string | null;
	createdAt: Date;
};

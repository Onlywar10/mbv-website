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
	spotsLeft: number;
};

export interface Stat {
	label: string;
	value: number;
	suffix: string;
	description: string;
}

// Events are now served from the database via lib/queries/events.ts
// Team members are now served from the database via lib/queries/team.ts

// ─── IMPACT STATS ────────────────────────────────────────

export const impactStats: Stat[] = [
	{
		label: "Veterans Impacted Yearly",
		value: 5000,
		suffix: "+",
		description: "Disabled veterans served through our programs each year",
	},
	{
		label: "Years of Service",
		value: 38,
		suffix: "+",
		description: "Continuously serving the veteran community since 1987",
	},
	{
		label: "Events Annually",
		value: 100,
		suffix: "+",
		description: "Fishing trips, whale watching, derbies, and community events",
	},
	{
		label: "Volunteer Hours",
		value: 10000,
		suffix: "+",
		description: "Hours donated by our incredible volunteer community",
	},
];

// ─── HISTORY MILESTONES ──────────────────────────────────

export interface Milestone {
	year: string;
	title: string;
	description: string;
}

export const milestones: Milestone[] = [
	{
		year: "1987",
		title: "The First Salmon Derby",
		description:
			"Monterey Bay Veterans holds its first wheelchair-accessible salmon derby, establishing a tradition that continues to this day.",
	},
	{
		year: "1995",
		title: "Expanding Programs",
		description:
			"MBV adds whale watching expeditions and community events, broadening access to the healing power of the ocean.",
	},
	{
		year: "2005",
		title: "ADA Shuttle Service",
		description:
			"Launch of ADA-compliant special needs event shuttles, ensuring disabled veterans can access local community events.",
	},
	{
		year: "2015",
		title: "Growing Community",
		description:
			"MBV surpasses 3,000 veterans served annually, with volunteer partnerships at Laguna Seca, Pebble Beach, and beyond.",
	},
	{
		year: "2020",
		title: "Resilience Through Challenge",
		description:
			"MBV adapts programs during challenging times, finding innovative ways to continue serving the veteran community safely.",
	},
	{
		year: "2024",
		title: "The Pescador Joins the Fleet",
		description:
			"MBV launches the Pescador, a fully wheelchair-accessible vessel operating out of Monterey Harbor.",
	},
	{
		year: "2026",
		title: "5,000+ Veterans Annually",
		description:
			"Today, MBV impacts over 5,000 veterans yearly through fishing trips, whale watching, derbies, volunteer events, and community programs.",
	},
];

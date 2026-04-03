export interface TeamMember {
	name: string;
	title: string;
	bio: string;
	image: string;
}

export interface Stat {
	label: string;
	value: number;
	suffix: string;
	description: string;
}

// Events are now served from the database via lib/queries/events.ts

// --- TEAM ------------------------------------------------

export const team: TeamMember[] = [
	{
		name: "Jefferson Ward",
		title: "Executive Director",
		bio: "Jefferson leads MBV's mission with a passion for serving those who served. Under his leadership, the organization has expanded its programs to impact over 5,000 veterans annually.",
		image: "/images/team/JeffWard.jpg",
	},
	{
		name: "Tiffany Bass-Breazile",
		title: "Board President",
		bio: "Tiffany brings extensive nonprofit leadership experience to MBV, guiding strategic direction and community partnerships that strengthen our veteran programs.",
		image: "/images/team/Tiffany.jpg",
	},
	{
		name: "James Bogan",
		title: "Vice President",
		bio: "James is a dedicated advocate for disabled veterans and plays a key role in program development and community outreach for MBV.",
		image: "/images/team/JamesBogan.png",
	},
	{
		name: "Kirk Johnson",
		title: "Treasurer & Secretary",
		bio: "Kirk ensures MBV's financial stewardship and organizational excellence, managing resources to maximize impact for the veteran community.",
		image: "/images/team/KirkJohnson.jpg",
	},
	{
		name: "Gina Ward",
		title: "Director of Volunteer Operations",
		bio: "Gina coordinates hundreds of volunteers across all MBV events, from fishing trips to community fundraisers, ensuring every event runs smoothly.",
		image: "/images/team/GinaWard.jpg",
	},
	{
		name: "Patricia Hendrix",
		title: "Board Member",
		bio: "Patricia contributes her expertise in community health and veteran services to guide MBV's programs and partnerships.",
		image: "/images/team/Patricia.jpg",
	},
	{
		name: "Ed Corliss",
		title: "Board Member",
		bio: "Ed brings decades of marine and boating experience to MBV, supporting fleet operations and on-water safety for all veteran programs.",
		image: "/images/team/EdCorliss.png",
	},
];

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

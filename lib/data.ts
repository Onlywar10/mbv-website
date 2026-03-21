export interface TeamMember {
	name: string;
	title: string;
	bio: string;
	image: string;
}

export interface Testimonial {
	id: number;
	name: string;
	branch: string;
	yearsServed: string;
	quote: string;
	longQuote: string;
	image: string;
}

export interface Stat {
	label: string;
	value: number;
	suffix: string;
	description: string;
}

export interface DonationTier {
	name: string;
	amount: string;
	description: string;
	features: string[];
}

// Events are now served from the database via lib/queries/events.ts

// --- TEAM ------------------------------------------------

export const team: TeamMember[] = [
	{
		name: "Jefferson Ward",
		title: "Executive Director",
		bio: "Jefferson leads MBV's mission with a passion for serving those who served. Under his leadership, the organization has expanded its programs to impact over 5,000 veterans annually.",
		image:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
	},
	{
		name: "Tiffany Bass-Breazile",
		title: "Board President",
		bio: "Tiffany brings extensive nonprofit leadership experience to MBV, guiding strategic direction and community partnerships that strengthen our veteran programs.",
		image:
			"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face",
	},
	{
		name: "James Bogan",
		title: "Vice President",
		bio: "James is a dedicated advocate for disabled veterans and plays a key role in program development and community outreach for MBV.",
		image:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
	},
	{
		name: "Kirk Johnson",
		title: "Treasurer & Secretary",
		bio: "Kirk ensures MBV's financial stewardship and organizational excellence, managing resources to maximize impact for the veteran community.",
		image:
			"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
	},
	{
		name: "Gina Ward",
		title: "Director of Volunteer Operations",
		bio: "Gina coordinates hundreds of volunteers across all MBV events, from fishing trips to community fundraisers, ensuring every event runs smoothly.",
		image:
			"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face",
	},
	{
		name: "Patricia Hendrix",
		title: "Board Member",
		bio: "Patricia contributes her expertise in community health and veteran services to guide MBV's programs and partnerships.",
		image:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
	},
	{
		name: "Ed Corliss",
		title: "Board Member",
		bio: "Ed brings decades of marine and boating experience to MBV, supporting fleet operations and on-water safety for all veteran programs.",
		image:
			"https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop&crop=face",
	},
];

// ─── TESTIMONIALS ────────────────────────────────────────

export const testimonials: Testimonial[] = [
	{
		id: 1,
		name: "Marcus Thompson",
		branch: "U.S. Marine Corps",
		yearsServed: "2004-2012",
		quote:
			"Being out on the water with other veterans who understand — that's something no therapy session can replicate.",
		longQuote:
			"After two deployments, I struggled with the transition back to civilian life. A buddy told me about MBV's fishing trips. That first morning on the Pescador, watching the sun rise over Monterey Bay, I felt something I hadn't felt in years — peace. Being out on the water with other veterans who understand, who've been through it — that's something no therapy session can replicate. MBV gave me my weekends back. They gave me a community.",
		image:
			"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face",
	},
	{
		id: 2,
		name: "Sarah Mitchell",
		branch: "U.S. Navy",
		yearsServed: "2008-2016",
		quote:
			"MBV doesn't just take you fishing — they remind you that you're still part of something bigger than yourself.",
		longQuote:
			"I was medically retired after an injury during my second deployment. The isolation was the hardest part. When I found Monterey Bay Veterans, I was skeptical — another veteran program, right? But from the moment I stepped on that boat, I knew this was different. The volunteers genuinely care. The other veterans become your family. MBV doesn't just take you fishing — they remind you that you're still part of something bigger than yourself.",
		image:
			"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
	},
	{
		id: 3,
		name: "Robert Chen",
		branch: "U.S. Army",
		yearsServed: "1998-2008",
		quote: "My wheelchair doesn't stop me from catching a 20-pound salmon. MBV made sure of that.",
		longQuote:
			"When you're in a wheelchair, people assume there are a lot of things you can't do. MBV showed me that fishing isn't one of them. Their boat is fully accessible, the crew helps with everything, and out there on the bay, I'm not a disabled veteran — I'm just a fisherman trying to land a big one. My wheelchair doesn't stop me from catching a 20-pound salmon. MBV made sure of that. I've been coming to the salmon derby every year since 2015.",
		image:
			"https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&h=300&fit=crop&crop=face",
	},
	{
		id: 4,
		name: "Diana Reyes",
		branch: "U.S. Air Force",
		yearsServed: "2010-2018",
		quote:
			"The whale watching trip was the first time my kids saw me truly relax since coming home.",
		longQuote:
			"My daughter signed us up for the whale watching trip. She said, 'Mom, you need to get outside.' She was right. Standing on that boat, watching a humpback whale breach just a hundred yards away, with my kids screaming with excitement — I cried. It was the first time they'd seen me truly relax since coming home. MBV gave my family a memory we'll never forget. We've been on three more trips since.",
		image:
			"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face",
	},
	{
		id: 5,
		name: 'James "JD" Davidson',
		branch: "U.S. Coast Guard",
		yearsServed: "2001-2011",
		quote: "I came for the fishing. I stayed for the brotherhood. MBV is family.",
		longQuote:
			"Being Coast Guard, I always loved the water. But after my service, I lost touch with it. MBV brought me back. The fishing is incredible — Monterey Bay is world-class — but it's the people that keep me coming back. I've made lifelong friends through these trips. Now I volunteer as crew on the Pescador. I came for the fishing. I stayed for the brotherhood. MBV is family.",
		image:
			"https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=300&h=300&fit=crop&crop=face",
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

// ─── DONATION TIERS ──────────────────────────────────────

export const donationTiers: DonationTier[] = [
	{
		name: "Supporter",
		amount: "$25",
		description: "Help cover bait and tackle for one veteran fishing trip",
		features: ["Thank-you letter from MBV", "Name on our supporters page", "Quarterly newsletter"],
	},
	{
		name: "Advocate",
		amount: "$50",
		description: "Sponsor a veteran's spot on a whale watching expedition",
		features: ["Everything in Supporter", "MBV sticker and pin", "Social media recognition"],
	},
	{
		name: "Champion",
		amount: "$100",
		description: "Fund a complete fishing trip experience for one veteran",
		features: ["Everything in Advocate", "MBV t-shirt", "Invitation to annual celebration"],
	},
	{
		name: "Hero",
		amount: "$250+",
		description: "Sponsor an entire group outing for disabled veterans",
		features: [
			"Everything in Champion",
			"Personal thank-you from Executive Director",
			"Sponsor recognition at events",
			"Annual impact report",
		],
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

// ─── PROGRAMS ────────────────────────────────────────────

export interface Program {
	title: string;
	description: string;
	icon: string;
	stats: string;
}

export const programs: Program[] = [
	{
		title: "Fishing Trips",
		description:
			"Year-round deep-sea fishing excursions aboard the Pescador targeting rockfish, salmon, and Dungeness crab. All equipment provided free of charge.",
		icon: "fish",
		stats: "40+ trips per year",
	},
	{
		title: "Whale Watching",
		description:
			"Guided expeditions to see gray whales, humpbacks, orcas, and dolphins in the rich waters of Monterey Bay National Marine Sanctuary.",
		icon: "waves",
		stats: "20+ expeditions per year",
	},
	{
		title: "Salmon Derbies",
		description:
			"Our flagship wheelchair-accessible salmon fishing tournaments, running annually since 1987 with prizes and community celebrations.",
		icon: "trophy",
		stats: "38 consecutive years",
	},
	{
		title: "ADA Shuttle Service",
		description:
			"Wheelchair-accessible shuttles transporting disabled veterans to local events including raceway, golf, fairground, and community gatherings.",
		icon: "bus",
		stats: "500+ rides per year",
	},
];

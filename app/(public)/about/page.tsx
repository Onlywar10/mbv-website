import { Accessibility, Heart, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PageHero } from "@/components/layout/page-hero";
import { GalleryCarousel } from "@/components/sections/gallery-carousel";
import { HistoryTimeline } from "@/components/sections/history-timeline";
import { LeadershipGrid } from "@/components/sections/leadership-grid";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { impactStats, milestones, team } from "@/lib/data";
import { getGalleryImages } from "@/lib/queries/gallery";

export const metadata = {
	title: "About & Impact",
	description:
		"Learn about Monterey Bay Veterans' mission, history, leadership, and impact on the disabled veteran community since 1987.",
};

const values = [
	{
		icon: Accessibility,
		title: "Accessibility",
		description:
			"Every program we offer is fully wheelchair-accessible, ensuring no veteran is left behind regardless of ability.",
	},
	{
		icon: Users,
		title: "Community",
		description:
			"We build lasting bonds between veterans, volunteers, and supporters who share a commitment to service.",
	},
	{
		icon: Heart,
		title: "Healing",
		description:
			"The therapeutic power of the ocean and shared experience provides healing that goes beyond traditional care.",
	},
];

export default async function AboutPage() {
	const galleryImages = await getGalleryImages();
	return (
		<article>
			{/* -- 1. Page Hero ----------------------------------- */}
			<PageHero
				title="About Monterey Bay Veterans"
				subtitle="Dedicated to serving the disabled veteran community since 1987"
				image="/images/about/About-Us-Hero.png"
			/>

			{/* -- 2. Mission & Vision ---------------------------- */}
			<section className="bg-cream py-20">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<SectionHeading title="Our Mission" subtitle="Why we do what we do" />

					<div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
						{/* Left: Mission statement */}
						<ScrollReveal direction="left">
							<div className="space-y-6">
								<p className="text-lg leading-relaxed text-foreground/90">
									Monterey Bay Veterans, Inc. is dedicated to serving the disabled veteran community
									of Monterey Bay, providing recreational fishing, whale watching, and community
									events at no cost to veterans through the generous support of sponsors and donors.
								</p>
								<p className="text-base leading-relaxed text-muted-foreground">
									For nearly four decades, we have been committed to the belief that the healing
									power of the ocean, the camaraderie of shared experience, and the dignity of
									accessible recreation can make a profound difference in the lives of those who
									have served our country.
								</p>
								<div className="h-1 w-16 bg-ochre" />
							</div>
						</ScrollReveal>

						{/* Right: Values */}
						<ScrollReveal direction="right">
							<div className="space-y-8">
								{values.map((value) => {
									const Icon = value.icon;
									return (
										<div key={value.title} className="flex gap-4">
											<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-rust/10 text-rust">
												<Icon className="h-6 w-6" />
											</div>
											<div>
												<h3 className="font-bold text-primary">{value.title}</h3>
												<p className="mt-1 text-sm leading-relaxed text-muted-foreground">
													{value.description}
												</p>
											</div>
										</div>
									);
								})}
							</div>
						</ScrollReveal>
					</div>
				</div>
			</section>

			{/* -- 3. History Timeline ---------------------------- */}
			<section className="bg-stone py-20">
				<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
					<SectionHeading
						title="Our History"
						subtitle="Nearly four decades of service to the veteran community"
					/>
					<HistoryTimeline milestones={milestones} />
				</div>
			</section>

			{/* -- 4. Leadership Team ----------------------------- */}
			<section className="bg-cream py-20">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<SectionHeading
						title="Our Leadership"
						subtitle="Meet the dedicated team guiding our mission"
					/>
					<LeadershipGrid team={team} />
				</div>
			</section>

			{/* -- 5. Our Fleet — The Pescador -------------------- */}
			<section className="bg-stone py-20">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
						<ScrollReveal direction="left">
							<div className="relative aspect-[8/5] overflow-hidden rounded-sm shadow-sharp">
								<Image
									src="/images/about/MBV-Boat.png"
									alt="The Pescador — MBV's wheelchair-accessible vessel on Monterey Bay"
									fill
									className="object-cover"
									sizes="(max-width: 1024px) 100vw, 50vw"
								/>
							</div>
						</ScrollReveal>

						<ScrollReveal direction="right">
							<div className="space-y-6">
								<div>
									<span className="text-sm font-semibold uppercase tracking-wider text-rust">
										Our Fleet
									</span>
									<h2 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
										The Pescador
									</h2>
								</div>
								<p className="text-lg leading-relaxed text-foreground/90">
									The Pescador is the heart of our fleet — a fully wheelchair-accessible vessel
									operating out of Monterey Harbor. Purpose-built for inclusive maritime
									experiences, she allows disabled veterans to enjoy deep-sea fishing, whale
									watching, and the beauty of Monterey Bay without barriers.
								</p>
								<ul className="space-y-3 text-muted-foreground">
									<li className="flex items-start gap-2">
										<span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rust" />
										ADA-compliant throughout with wide passageways and roll-on access
									</li>
									<li className="flex items-start gap-2">
										<span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rust" />
										Equipped with adaptive fishing gear and safety equipment
									</li>
									<li className="flex items-start gap-2">
										<span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rust" />
										Experienced volunteer crew trained in accessibility assistance
									</li>
									<li className="flex items-start gap-2">
										<span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rust" />
										Accommodates up to 25 veterans per trip
									</li>
								</ul>
								<div className="h-1 w-16 bg-ochre" />
							</div>
						</ScrollReveal>
					</div>
				</div>
			</section>

			{/* -- 6. Impact Dashboard ---------------------------- */}
			<section className="section-gradient py-20">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<SectionHeading
						title="Our Impact"
						subtitle="Measuring what matters — the lives we touch"
						light
					/>

					<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
						{impactStats.map((stat) => (
							<AnimatedCounter
								key={stat.label}
								value={stat.value}
								suffix={stat.suffix}
								label={stat.label}
								description={stat.description}
								light
							/>
						))}
					</div>
				</div>
			</section>

			{/* -- 7. Photo Gallery -------------------------------- */}
			<section className="bg-stone py-20">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<SectionHeading
						title="Life on the Water"
						subtitle="Moments from our fishing trips, whale watching expeditions, and community events"
					/>
				</div>
				<GalleryCarousel
					variant="full"
					images={galleryImages.map((img) => ({ src: img.url, alt: img.alt ?? "" }))}
				/>
			</section>

			{/* -- 9. CTA ----------------------------------------- */}
			<section className="bg-stone py-20">
				<div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
					<ScrollReveal>
						<h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
							Ready to get involved?
						</h2>
						<p className="mt-4 text-lg text-muted-foreground">
							Whether you want to join us on the water, volunteer your time, or support our mission
							through a donation, there are many ways to make a difference in a veteran&apos;s life.
						</p>
						<div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
							<Link
								href="/events"
								className="inline-flex h-11 items-center justify-center rounded-sm bg-ink px-8 font-heading text-sm font-medium uppercase tracking-wider text-cream transition-colors hover:bg-ink/90"
							>
								View Upcoming Events
							</Link>
							<Link
								href="/support"
								className="inline-flex h-11 items-center justify-center rounded-sm bg-rust px-8 font-heading text-sm font-medium uppercase tracking-wider text-cream transition-colors hover:bg-rust-light"
							>
								Support Our Mission
							</Link>
						</div>
					</ScrollReveal>
				</div>
			</section>
		</article>
	);
}

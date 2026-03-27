import { AboutPreview } from "@/components/sections/about-preview";
import { CtaBanner } from "@/components/sections/cta-banner";
import { EventPreview } from "@/components/sections/event-preview";
import { GalleryCarousel } from "@/components/sections/gallery-carousel";
import { Hero } from "@/components/sections/hero";
import { ImpactCounters } from "@/components/sections/impact-counters";
import { MissionBar } from "@/components/sections/mission-bar";
import { getRegistrationCountsByEvent, getPublishedEvents } from "@/lib/queries/events";
import { getGalleryImages } from "@/lib/queries/gallery";

export default async function Home() {
	const [rawEvents, registrationCounts, galleryImages] = await Promise.all([
		getPublishedEvents(),
		getRegistrationCountsByEvent(),
		getGalleryImages(),
	]);

	const events = rawEvents.map((e) => ({
		...e,
		spotsLeft: Math.max(0, e.participantCapacity - (registrationCounts[e.id]?.participants ?? 0)),
	}));

	return (
		<>
			<Hero />
			<MissionBar />
			<ImpactCounters />
			<EventPreview events={events} />
			<section className="bg-stone py-16">
				<div className="mx-auto max-w-7xl px-6">
					<h2 className="mb-2 text-center text-2xl font-heading uppercase tracking-tight text-primary sm:text-3xl">
						Moments on the Water
					</h2>
					<p className="mb-8 text-center text-muted-foreground">
						A glimpse into the experiences we create for our veterans.
					</p>
				</div>
				<GalleryCarousel
					variant="compact"
					images={galleryImages.map((img) => ({ src: img.url, alt: img.alt ?? "" }))}
				/>
			</section>
			<AboutPreview />
			<CtaBanner />
		</>
	);
}

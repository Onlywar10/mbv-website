import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHero } from "@/components/layout/page-hero";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { getClientById } from "@/lib/queries/clients";
import { getVolunteerEvents } from "@/lib/queries/events";
import { VolunteerEventCard } from "./volunteer-event-card";

export const metadata: Metadata = {
	title: "Select Volunteer Events",
	description: "Choose which events you'd like to volunteer for.",
};

type PageProps = {
	searchParams: Promise<{ clientId?: string }>;
};

export default async function VolunteerEventsPage({ searchParams }: PageProps) {
	const { clientId } = await searchParams;

	if (!clientId) {
		redirect("/support#volunteer-form");
	}

	const client = await getClientById(clientId);
	if (!client) {
		redirect("/support#volunteer-form");
	}

	const events = await getVolunteerEvents();

	return (
		<>
			<PageHero
				title="Volunteer for Events"
				subtitle={`Welcome, ${client.firstName}! Select the events you'd like to volunteer for.`}
				image="/images/support/support-image.jpg"
			/>

			<section className="bg-cream py-20">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<Link
						href="/support#volunteer-form"
						className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
					>
						<ChevronLeft className="h-4 w-4" />
						Back to Support
					</Link>

					<ScrollReveal>
						<SectionHeading
							title="Available Events"
							subtitle="Click 'Volunteer' on any event you'd like to help out with. Your signup will be reviewed by our team."
						/>
					</ScrollReveal>

					{events.length === 0 ? (
						<p className="py-12 text-center text-muted-foreground">
							No events available right now. Check back soon!
						</p>
					) : (
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{events.map((event) => (
								<VolunteerEventCard key={event.id} event={event} clientId={clientId} />
							))}
						</div>
					)}
				</div>
			</section>
		</>
	);
}

"use client";

import { Anchor } from "lucide-react";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

export function MissionBar() {
	return (
		<section className="section-gradient py-16">
			<div className="mx-auto max-w-4xl px-6 text-center">
				<ScrollReveal>
					<Anchor className="mx-auto mb-4 h-8 w-8 text-ochre" />
					<p className="text-xl font-medium leading-relaxed text-white sm:text-2xl md:text-3xl">
						Monterey Bay Veterans provides free recreational fishing, whale watching, community
						events, and ADA shuttle services to{" "}
						<span className="font-bold text-ochre">disabled veterans</span> in the Monterey Bay
						area.
					</p>
				</ScrollReveal>
			</div>
		</section>
	);
}

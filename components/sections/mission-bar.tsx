"use client";

import { Anchor } from "lucide-react";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

export function MissionBar() {
	return (
		<section className="section-gradient py-10 sm:py-16">
			<div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
				<ScrollReveal>
					<Anchor className="mx-auto mb-3 h-6 w-6 text-ochre sm:mb-4 sm:h-8 sm:w-8" />
					<p className="text-base font-medium leading-relaxed text-white sm:text-2xl md:text-3xl">
						Free fishing, whale watching, and community events for{" "}
						<span className="font-bold text-ochre">disabled veterans</span>
						<span className="hidden sm:inline">
							{" "}in the Monterey Bay area — plus ADA shuttle services
						</span>.
					</p>
				</ScrollReveal>
			</div>
		</section>
	);
}

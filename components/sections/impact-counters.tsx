"use client";

import { AnimatedCounter } from "@/components/shared/animated-counter";
import { impactStats } from "@/lib/data";

export function ImpactCounters() {
	return (
		<section className="bg-ink py-20">
			<div className="mx-auto max-w-6xl px-6">
				<div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
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
	);
}

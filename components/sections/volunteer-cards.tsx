"use client";

import { Anchor, Flag, Heart, Star, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { VolunteerOpportunity } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
	trophy: Trophy,
	flag: Flag,
	star: Star,
	anchor: Anchor,
	heart: Heart,
};

interface VolunteerCardsProps {
	opportunities: VolunteerOpportunity[];
}

export function VolunteerCards({ opportunities }: VolunteerCardsProps) {
	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{opportunities.map((opp, i) => {
				const Icon = iconMap[opp.icon] ?? Heart;
				return (
					<ScrollReveal key={opp.title} delay={i * 0.1}>
						<motion.div
							whileHover={{ scale: 1.02, y: -4 }}
							transition={{ type: "spring", stiffness: 300, damping: 20 }}
							className="h-full"
						>
							<Card className="h-full rounded-sm bg-cream ring-1 ring-border transition-shadow hover:shadow-sharp">
								<CardHeader>
									<div className="mb-2 flex h-10 w-10 items-center justify-center rounded-sm bg-rust/10">
										<Icon className="h-5 w-5 text-rust" />
									</div>
									<CardTitle className="text-lg">{opp.title}</CardTitle>
									<CardDescription className="flex flex-wrap items-center gap-2">
										<Badge variant="secondary" className="text-xs">
											{opp.location}
										</Badge>
										<span className="text-xs text-muted-foreground">{opp.dates}</span>
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm leading-relaxed text-muted-foreground">{opp.description}</p>
								</CardContent>
							</Card>
						</motion.div>
					</ScrollReveal>
				);
			})}
		</div>
	);
}

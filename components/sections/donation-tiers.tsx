"use client";

import { Check, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { DonationTier } from "@/lib/data";
import { cn } from "@/lib/utils";

interface DonationTiersProps {
	tiers: DonationTier[];
}

export function DonationTiers({ tiers }: DonationTiersProps) {
	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{tiers.map((tier, i) => (
				<ScrollReveal key={tier.name} delay={i * 0.1}>
					<motion.div
						whileHover={{ scale: 1.02, y: -4 }}
						transition={{ type: "spring", stiffness: 300, damping: 20 }}
						className="h-full"
					>
						<Card
							className={cn(
								"relative flex h-full flex-col rounded-sm bg-cream transition-shadow hover:shadow-sharp ring-1 ring-border",
								tier.highlighted && "ring-2 ring-ochre shadow-sharp",
							)}
						>
							{tier.highlighted && (
								<div className="absolute -top-3 left-1/2 -translate-x-1/2">
									<span className="inline-flex items-center gap-1 rounded-full bg-ochre px-3 py-1 text-xs font-semibold text-ink">
										<Sparkles className="h-3 w-3" />
										Most Impact
									</span>
								</div>
							)}
							<CardHeader className={cn(tier.highlighted && "pt-4")}>
								<CardTitle
									className={cn(
										"text-base font-semibold",
										tier.highlighted ? "text-ochre" : "text-primary",
									)}
								>
									{tier.name}
								</CardTitle>
								<div
									className={cn(
										"text-3xl font-bold tracking-tight",
										tier.highlighted ? "text-ochre" : "text-rust",
									)}
								>
									{tier.amount}
								</div>
								<CardDescription>{tier.description}</CardDescription>
							</CardHeader>
							<CardContent className="flex-1">
								<ul className="space-y-2">
									{tier.features.map((feature) => (
										<li
											key={feature}
											className="flex items-start gap-2 text-sm text-muted-foreground"
										>
											<Check
												className={cn(
													"mt-0.5 h-4 w-4 shrink-0",
													tier.highlighted ? "text-ochre" : "text-rust",
												)}
											/>
											{feature}
										</li>
									))}
								</ul>
							</CardContent>
							<CardFooter>
								<Button
									disabled
									className="w-full rounded-sm bg-rust font-heading uppercase tracking-wider text-cream"
								>
									Coming Soon
								</Button>
							</CardFooter>
						</Card>
					</motion.div>
				</ScrollReveal>
			))}
		</div>
	);
}

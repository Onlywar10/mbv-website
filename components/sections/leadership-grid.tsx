"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { TeamMember } from "@/lib/data";

interface LeadershipGridProps {
	team: TeamMember[];
}

export function LeadershipGrid({ team }: LeadershipGridProps) {
	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{team.map((member, index) => (
				<motion.div
					key={member.name}
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-60px" }}
					transition={{
						duration: 0.5,
						delay: index * 0.1,
						ease: "easeOut",
					}}
				>
					<Card className="h-full rounded-sm bg-cream text-center shadow-sharp ring-1 ring-border">
						<CardHeader className="items-center pb-0">
							<div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full ring-2 ring-rust/20">
								<Image
									src={member.image}
									alt={member.name}
									fill
									className="object-cover"
									sizes="96px"
								/>
							</div>
							<CardTitle className="font-heading text-lg">{member.name}</CardTitle>
							<CardDescription className="font-medium text-rust">{member.title}</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
						</CardContent>
					</Card>
				</motion.div>
			))}
		</div>
	);
}

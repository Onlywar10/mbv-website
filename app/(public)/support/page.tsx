import { ArrowRight, Check, Crown, HandCoins, Sparkles } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { PageHero } from "@/components/layout/page-hero";
import { VolunteerForm } from "@/components/sections/volunteer-form";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
	title: "Support Us",
	description:
		"Support Monterey Bay Veterans through donations, membership, or volunteering. Help provide free fishing and community events for disabled veterans.",
};

const membershipBenefits = [
	"Support veteran programs year-round",
	"Voting rights at annual meetings",
	"Quarterly newsletter and updates",
	"Invitation to member-only events",
	"MBV member card and merchandise",
];

export default function SupportPage() {
	return (
		<main>
			{/* --- 1. Page Hero ------------------------------- */}
			<PageHero
				title="Support Our Veterans"
				subtitle="Donate, become a member, or volunteer your time to serve disabled veterans"
				image="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&h=600&fit=crop"
			/>

			{/* --- 2. Donate ---------------------------------- */}
			<section className="py-20">
				<div className="mx-auto max-w-6xl px-6">
					<ScrollReveal>
						<SectionHeading
							title="Make a Donation"
							subtitle="Every contribution helps a veteran experience the healing power of the ocean"
						/>
					</ScrollReveal>

					<ScrollReveal delay={0.1}>
						<div className="mx-auto mb-12 max-w-2xl text-center">
							<p className="text-muted-foreground leading-relaxed">
								Monterey Bay Veterans is a 501(c)(19) nonprofit. Your generous contributions fund
								free fishing trips, whale watching expeditions, adaptive equipment, and community
								events for disabled veterans throughout the Monterey Bay region.
							</p>
						</div>
					</ScrollReveal>

					{/* GiveButter donation widget */}
					<div
						className="mx-auto max-w-lg"
						dangerouslySetInnerHTML={{
							__html: '<givebutter-widget id="gmBVGm"></givebutter-widget>',
						}}
					/>
					<Script
						src="https://widgets.givebutter.com/latest.umd.cjs?acct=UXc2o743eV4mLOV3&p=other"
						strategy="afterInteractive"
					/>

					<ScrollReveal delay={0.3}>
						<p className="mt-6 text-center text-xs text-muted-foreground">
							All donations are tax-deductible. MBV is a registered 501(c)(19) veterans
							organization.
						</p>
					</ScrollReveal>
				</div>
			</section>

			{/* --- 3. Membership ------------------------------ */}
			<section className="bg-cream py-20">
				<div className="mx-auto max-w-4xl px-6">
					<ScrollReveal>
						<SectionHeading
							title="Become a Member"
							subtitle="Join our community and help sustain programs that serve veterans year-round"
						/>
					</ScrollReveal>

					<ScrollReveal delay={0.1}>
						<div className="mx-auto mb-12 max-w-2xl text-center">
							<p className="text-muted-foreground leading-relaxed">
								MBV members play a vital role in keeping our programs running. Your membership
								directly funds fishing trips, whale watching expeditions, and community events for
								disabled veterans.
							</p>
						</div>
					</ScrollReveal>

					<div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
						{/* Annual */}
						<ScrollReveal delay={0.15}>
							<Card className="relative flex h-full flex-col overflow-visible rounded-sm bg-card ring-2 ring-ochre shadow-sharp transition-shadow">
								<CardHeader>
									<CardTitle className="text-base font-semibold text-primary">
										Annual Membership
									</CardTitle>
									<div className="text-3xl font-bold tracking-tight text-rust">
										$40
										<span className="text-base font-normal text-muted-foreground">/year</span>
									</div>
								</CardHeader>
								<CardContent className="flex-1">
									<ul className="space-y-2">
										{membershipBenefits.map((benefit) => (
											<li
												key={benefit}
												className="flex items-start gap-2 text-sm text-muted-foreground"
											>
												<Check className="mt-0.5 h-4 w-4 shrink-0 text-rust" />
												{benefit}
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
						</ScrollReveal>

						{/* Lifetime */}
						<ScrollReveal delay={0.25}>
							<Card className="relative flex h-full flex-col overflow-visible rounded-sm bg-card ring-2 ring-ochre shadow-sharp transition-shadow">
								<div className="absolute -top-3 left-1/2 -translate-x-1/2">
									<span className="inline-flex items-center gap-1 rounded-full bg-ochre px-3 py-1 text-xs font-semibold text-ink">
										<Sparkles className="h-3 w-3" />
										Best Value
									</span>
								</div>
								<CardHeader className="pt-4">
									<CardTitle className="flex items-center gap-2 text-base font-semibold text-ochre">
										<Crown className="h-4 w-4" />
										Lifetime Membership
									</CardTitle>
									<div className="text-3xl font-bold tracking-tight text-ochre">
										$385
										<span className="text-base font-normal text-muted-foreground"> one-time</span>
									</div>
								</CardHeader>
								<CardContent className="flex-1">
									<ul className="space-y-2">
										{membershipBenefits.map((benefit) => (
											<li
												key={benefit}
												className="flex items-start gap-2 text-sm text-muted-foreground"
											>
												<Check className="mt-0.5 h-4 w-4 shrink-0 text-ochre" />
												{benefit}
											</li>
										))}
										<li className="flex items-start gap-2 text-sm font-medium text-ochre">
											<Check className="mt-0.5 h-4 w-4 shrink-0" />
											Never pay dues again
										</li>
									</ul>
								</CardContent>
								<CardFooter>
									<Button
										disabled
										className="w-full rounded-sm bg-ochre font-heading uppercase tracking-wider text-ink"
									>
										Coming Soon
									</Button>
								</CardFooter>
							</Card>
						</ScrollReveal>
					</div>
				</div>
			</section>

			{/* --- 4. Volunteer ------------------------------- */}
			<VolunteerForm />

			{/* --- 5. Bottom CTA ------------------------------ */}
			<section className="section-gradient py-20">
				<div className="mx-auto max-w-3xl px-6 text-center">
					<ScrollReveal>
						<HandCoins className="mx-auto mb-4 h-10 w-10 text-ochre" />
						<h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
							Questions? We&apos;d Love to Hear From You
						</h2>
						<p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
							Whether you want to donate, become a member, or volunteer, we&apos;re here to help.
						</p>
						<div className="mt-8">
							<Link
								href="/events"
								className="inline-flex h-12 items-center justify-center rounded-sm bg-ochre px-8 font-heading text-base font-semibold uppercase tracking-wider text-ink transition-colors hover:bg-ochre-light"
							>
								Get in Touch
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</div>
					</ScrollReveal>
				</div>
			</section>
		</main>
	);
}

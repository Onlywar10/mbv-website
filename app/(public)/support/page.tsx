import Link from "next/link";
import {
  Heart,
  Users,
  Star,
  HandCoins,
  Smartphone,
  CreditCard,
  ClipboardList,
  Gift,
  Mail,
  ArrowRight,
} from "lucide-react";
import { volunteerOpportunities, donationTiers } from "@/lib/data";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { VolunteerForm } from "@/components/sections/volunteer-form";
import { VolunteerCards } from "@/components/sections/volunteer-cards";
import { DonationTiers } from "@/components/sections/donation-tiers";

export const metadata = {
  title: "Get Involved",
  description:
    "Volunteer with Monterey Bay Veterans or support our mission to provide free fishing and community events for disabled veterans.",
};

const whyReasons = [
  {
    icon: Heart,
    title: "Make a Difference",
    description:
      "Your time and support directly impacts the lives of disabled veterans in the Monterey Bay community.",
  },
  {
    icon: Users,
    title: "Build Community",
    description:
      "Join a passionate group of volunteers dedicated to honoring those who served our country.",
  },
  {
    icon: Star,
    title: "Create Memories",
    description:
      "Help create unforgettable experiences on the water that promote healing and connection.",
  },
];

const otherWays = [
  {
    icon: Smartphone,
    label: "Venmo",
    detail: "Send directly via @MontereyBayVeterans",
  },
  {
    icon: CreditCard,
    label: "PayPal",
    detail: "donate@montereybayvetera.org",
  },
  {
    icon: ClipboardList,
    label: "Membership Application",
    detail: "Become an official MBV member and supporter",
  },
  {
    icon: Gift,
    label: "In-Kind Donations",
    detail: "Fishing gear, event supplies, and other materials welcome",
  },
];

export default function SupportPage() {
  return (
    <main>
      {/* --- 1. Page Hero ------------------------------- */}
      <PageHero
        title="Get Involved"
        subtitle="Volunteer your time or support our mission to serve disabled veterans"
        image="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&h=600&fit=crop"
      />

      {/* --- 2. Why Get Involved ------------------------ */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <SectionHeading
              title="Why Get Involved"
              subtitle="Every hour volunteered and every dollar donated goes directly to serving those who served us"
            />
          </ScrollReveal>

          <div className="grid gap-8 sm:grid-cols-3">
            {whyReasons.map((reason, i) => {
              const Icon = reason.icon;
              return (
                <ScrollReveal key={reason.title} delay={i * 0.15}>
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rust/10">
                      <Icon className="h-7 w-7 text-rust" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-primary">
                      {reason.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {reason.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- 3. Volunteer Opportunities ----------------- */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <SectionHeading
              title="Volunteer Opportunities"
              subtitle="From racetracks to fishing boats, there's a role for everyone"
            />
          </ScrollReveal>

          <VolunteerCards opportunities={volunteerOpportunities} />

          <ScrollReveal delay={0.3}>
            <p className="mt-10 text-center text-sm text-muted-foreground">
              Don&apos;t see what you&apos;re looking for? We&apos;re always
              open to new ideas.{" "}
              <a
                href="#volunteer-form"
                className="font-medium text-rust underline underline-offset-4 hover:text-rust-light"
              >
                Tell us how you&apos;d like to help
              </a>
              .
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* --- 4. Volunteer Form -------------------------- */}
      <VolunteerForm />

      {/* --- 5. Support Our Mission (Donate) ------------ */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <SectionHeading
              title="Support Our Mission"
              subtitle="Every contribution helps a veteran experience the healing power of the ocean"
            />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-muted-foreground leading-relaxed">
                Monterey Bay Veterans is a 501(c)(19) nonprofit. Your generous
                contributions fund free fishing trips, whale watching
                expeditions, adaptive equipment, and community events for
                disabled veterans throughout the Monterey Bay region. Every
                dollar makes a real difference.
              </p>
            </div>
          </ScrollReveal>

          <DonationTiers tiers={donationTiers} />

          <ScrollReveal delay={0.3}>
            <p className="mt-10 text-center text-sm text-muted-foreground">
              All donations are tax-deductible. MBV is a registered 501(c)(19)
              veterans organization.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* --- 6. Other Ways to Give ---------------------- */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-4xl px-6">
          <ScrollReveal>
            <SectionHeading
              title="Other Ways to Give"
              subtitle="There are many ways to support our veteran programs"
            />
          </ScrollReveal>

          <div className="grid gap-6 sm:grid-cols-2">
            {otherWays.map((way, i) => {
              const Icon = way.icon;
              return (
                <ScrollReveal key={way.label} delay={i * 0.1}>
                  <div className="flex items-start gap-4 rounded-sm bg-card p-5 ring-1 ring-border">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-rust/10">
                      <Icon className="h-5 w-5 text-rust" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">
                        {way.label}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {way.detail}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal delay={0.4}>
            <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>
                Questions about giving?{" "}
                <a
                  href="mailto:info@montereybayvetera.org"
                  className="font-medium text-rust underline underline-offset-4 hover:text-rust-light"
                >
                  info@montereybayvetera.org
                </a>
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* --- 7. Bottom CTA ------------------------------ */}
      <section className="section-gradient py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <ScrollReveal>
            <HandCoins className="mx-auto mb-4 h-10 w-10 text-ochre" />
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Questions? We&apos;d Love to Hear From You
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
              Whether you want to volunteer, donate, or just learn more about
              how we serve disabled veterans, we&apos;re here to help.
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

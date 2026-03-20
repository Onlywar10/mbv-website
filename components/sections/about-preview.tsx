"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function AboutPreview() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Content */}
          <ScrollReveal direction="left">
            <div>
              <span className="mb-4 inline-block text-xs font-heading uppercase tracking-wider text-rust">
                About MBV
              </span>
              <h2 className="font-heading text-3xl tracking-tight text-ink sm:text-4xl">
                More Than Fishing — It&apos;s About Healing
              </h2>
              <div className="mt-4 h-1 w-20 bg-rust" />
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Since 1987, Monterey Bay Veterans has been dedicated to improving
                the quality of life for disabled veterans through the therapeutic
                power of the ocean. What started as a single wheelchair-accessible
                salmon derby has grown into a year-round program impacting over
                5,000 veterans annually.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Our programs include free deep-sea fishing trips, whale watching
                expeditions, community events, and ADA shuttle services — all
                designed to bring veterans together, reduce isolation, and create
                lasting memories on the beautiful waters of Monterey Bay.
              </p>
              <div className="mt-8">
                <Link
                  href="/about"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-11 gap-2 rounded-sm bg-ink px-6 font-heading uppercase text-white hover:bg-ink-soft"
                  )}
                >
                  Learn Our Story
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Right: Image */}
          <ScrollReveal direction="right" delay={0.2}>
            <div className="relative">
              <div className="overflow-hidden rounded-sm shadow-sharp">
                <img
                  src="/images/hero/MBV-Boat.png"
                  alt="The Pescador — Monterey Bay Veterans boat on Monterey Bay"
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-sm bg-rust/10" />
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -left-6 rounded-sm bg-white p-4 shadow-sharp ring-1 ring-border">
                <div className="text-3xl font-bold text-rust">38+</div>
                <div className="text-sm font-medium text-ink">
                  Years Serving Veterans
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

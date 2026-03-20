"use client";

import { motion } from "motion/react";
import { Check, Sparkles } from "lucide-react";
import type { DonationTier } from "@/lib/data";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { cn } from "@/lib/utils";

interface DonationTiersProps {
  tiers: DonationTier[];
}

export function DonationTiers({ tiers }: DonationTiersProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {tiers.map((tier, i) => {
        const isHero = tier.name === "Hero";
        return (
          <ScrollReveal key={tier.name} delay={i * 0.1}>
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="h-full"
            >
              <Card
                className={cn(
                  "relative h-full rounded-sm bg-cream transition-shadow hover:shadow-sharp ring-1 ring-border",
                  isHero &&
                    "ring-2 ring-ochre shadow-sharp"
                )}
              >
                {isHero && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-ochre px-3 py-1 text-xs font-semibold text-ink">
                      <Sparkles className="h-3 w-3" />
                      Most Impact
                    </span>
                  </div>
                )}
                <CardHeader className={cn(isHero && "pt-4")}>
                  <CardTitle
                    className={cn(
                      "text-base font-semibold",
                      isHero ? "text-ochre" : "text-primary"
                    )}
                  >
                    {tier.name}
                  </CardTitle>
                  <div
                    className={cn(
                      "text-3xl font-bold tracking-tight",
                      isHero ? "text-ochre" : "text-rust"
                    )}
                  >
                    {tier.amount}
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Check
                          className={cn(
                            "mt-0.5 h-4 w-4 shrink-0",
                            isHero ? "text-ochre" : "text-rust"
                          )}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </ScrollReveal>
        );
      })}
    </div>
  );
}

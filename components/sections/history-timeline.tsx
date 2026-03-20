"use client";

import { motion } from "motion/react";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import type { Milestone } from "@/lib/data";

interface HistoryTimelineProps {
  milestones: Milestone[];
}

export function HistoryTimeline({ milestones }: HistoryTimelineProps) {
  return (
    <div className="relative">
      {/* Vertical connecting line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-rust/20 md:left-1/2 md:-translate-x-px" />

      <div className="space-y-12">
        {milestones.map((milestone, index) => {
          const isLeft = index % 2 === 0;

          return (
            <ScrollReveal
              key={milestone.year}
              delay={index * 0.1}
              direction={isLeft ? "left" : "right"}
            >
              <div
                className={`relative flex items-start gap-6 md:gap-0 ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Year badge */}
                <div className="absolute left-0 z-10 md:left-1/2 md:-translate-x-1/2">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1 + 0.2,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-rust text-sm font-bold text-cream shadow-sharp"
                  >
                    {milestone.year.slice(-2)}
                  </motion.div>
                </div>

                {/* Content card */}
                <div
                  className={`ml-18 w-full md:ml-0 md:w-[calc(50%-2rem)] ${
                    isLeft ? "md:pr-4 md:text-right" : "md:pl-4 md:ml-auto"
                  }`}
                >
                  <div className="rounded-sm bg-cream p-6 shadow-sharp ring-1 ring-border">
                    <span className="mb-1 inline-block text-xs font-semibold uppercase tracking-wider text-rust">
                      {milestone.year}
                    </span>
                    <h3 className="text-lg font-bold text-primary">
                      {milestone.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}

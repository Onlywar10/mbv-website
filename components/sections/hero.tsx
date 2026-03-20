"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero/MBV-Boat.png"
          alt="The Pescador — Monterey Bay Veterans boat on the water"
          className="h-full w-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="font-heading uppercase text-balance text-4xl leading-tight tracking-[-0.03em] text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Serving Those Who Served
          <span className="mt-2 block text-rust">
            — On the Waters of Monterey Bay
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl"
        >
          Free recreational fishing, whale watching, and community events for
          disabled veterans since 1987.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/events"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 rounded-sm bg-rust px-8 text-base font-heading uppercase text-white hover:bg-rust-light"
            )}
          >
            View Events
          </Link>
          <Link
            href="/about"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-12 rounded-sm border-cream/30 bg-cream/10 px-8 text-base font-heading uppercase text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
            )}
          >
            Learn More
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs font-medium tracking-wider text-white/60 uppercase">
            Scroll to explore
          </span>
          <ChevronDown className="h-5 w-5 text-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Event } from "@/lib/data";

const categories = [
  { value: "all", label: "All" },
  { value: "fishing", label: "Fishing" },
  { value: "whale-watching", label: "Whale Watching" },
  { value: "volunteer", label: "Volunteer" },
  { value: "derby", label: "Derby" },
] as const;

const categoryColors: Record<Event["category"], string> = {
  fishing: "bg-rust text-cream",
  "whale-watching": "bg-ink text-cream",
  volunteer: "bg-ochre text-ink",
  community: "bg-secondary text-cream",
  derby: "bg-ink text-cream",
};

const categoryLabels: Record<Event["category"], string> = {
  fishing: "Fishing",
  "whale-watching": "Whale Watching",
  volunteer: "Volunteer",
  community: "Community",
  derby: "Derby",
};

function EventCard({ event, index }: { event: Event; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full overflow-hidden rounded-sm bg-cream ring-1 ring-border transition-shadow hover:shadow-sharp">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover/card:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-semibold ${categoryColors[event.category]}`}
            >
              {categoryLabels[event.category]}
            </span>
          </div>
        </div>

        <CardHeader className="pb-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 shrink-0 text-rust" />
            <time>{event.date}</time>
          </div>
          <CardTitle className="text-lg leading-snug text-primary">
            {event.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 text-rust" />
            <span className="truncate">{event.location}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
          <div className="mt-auto flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-rust/10 text-rust border-rust/20"
            >
              <Users className="mr-1 h-3 w-3" />
              {event.spotsAvailable} spots left
            </Badge>
          </div>
        </CardContent>

        <CardFooter>
          <Link
            href={`/events/${event.slug}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full rounded-sm font-heading uppercase tracking-wider"
            )}
          >
            View Details
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

interface EventFilterProps {
  events: Event[];
}

export function EventFilter({ events }: EventFilterProps) {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList
        className="mx-auto mb-8 flex flex-wrap gap-1 bg-muted/80 p-1 h-auto"
        aria-label="Filter events by category"
      >
        {categories.map((cat) => (
          <TabsTrigger
            key={cat.value}
            value={cat.value}
            className="px-4 py-2 text-sm"
          >
            {cat.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((cat) => {
        const filtered =
          cat.value === "all"
            ? events
            : events.filter((e) => e.category === cat.value);

        return (
          <TabsContent key={cat.value} value={cat.value}>
            {filtered.length === 0 ? (
              <p className="py-12 text-center text-muted-foreground">
                No events in this category right now. Check back soon!
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((event, i) => (
                  <EventCard key={event.slug} event={event} index={i} />
                ))}
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

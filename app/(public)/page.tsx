import { Hero } from "@/components/sections/hero";
import { MissionBar } from "@/components/sections/mission-bar";
import { ImpactCounters } from "@/components/sections/impact-counters";
import { EventPreview } from "@/components/sections/event-preview";
import { AboutPreview } from "@/components/sections/about-preview";
import { CtaBanner } from "@/components/sections/cta-banner";
import { GalleryCarousel } from "@/components/sections/gallery-carousel";

export default function Home() {
  return (
    <>
      <Hero />
      <MissionBar />
      <ImpactCounters />
      <EventPreview />
      <section className="bg-stone py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-2 text-center text-2xl font-heading uppercase tracking-tight text-primary sm:text-3xl">
            Moments on the Water
          </h2>
          <p className="mb-8 text-center text-muted-foreground">
            A glimpse into the experiences we create for our veterans.
          </p>
        </div>
        <GalleryCarousel variant="compact" />
      </section>
      <AboutPreview />
      <CtaBanner />
    </>
  );
}

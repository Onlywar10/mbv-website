"use client";

import { useRef, useEffect } from "react";
import { animate } from "motion";
import { galleryImages, type GalleryImage } from "@/lib/gallery";

// Deterministic "random" offsets per index so layout is consistent across renders
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

interface GalleryCarouselProps {
  /** "compact" for home page, "full" for about page */
  variant?: "compact" | "full";
}

// Size presets for the mosaic effect
const sizeClasses = [
  "w-48 h-64",  // tall
  "w-56 h-44",  // wide
  "w-44 h-44",  // square small
  "w-52 h-60",  // tall medium
  "w-60 h-48",  // wide medium
  "w-40 h-56",  // narrow tall
];

function GalleryCard({ image, index }: { image: GalleryImage; index: number }) {
  const sizeClass = sizeClasses[index % sizeClasses.length];
  // Vertical offset for the stacked/scattered look
  const yOffset = Math.round((seededRandom(index) * 40 - 20) * 100) / 100;
  const rotation = Math.round((seededRandom(index + 100) * 6 - 3) * 100) / 100;

  return (
    <div
      className={`${sizeClass} shrink-0 overflow-hidden rounded-sm shadow-sharp`}
      style={{
        transform: `translateY(${yOffset}px) rotate(${rotation}deg)`,
      }}
    >
      <img
        src={image.src}
        alt={image.alt}
        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
        loading="lazy"
      />
    </div>
  );
}

export function GalleryCarousel({ variant = "full" }: GalleryCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);

  // Triple the images for seamless infinite loop
  const images = [...galleryImages, ...galleryImages, ...galleryImages];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Measure one set of images (1/3 of the track)
    const singleSetWidth = track.scrollWidth / 3;

    // Animate: scroll the track left by one full set, then reset seamlessly
    animationRef.current = animate(
      track,
      { x: [0, -singleSetWidth] },
      {
        duration: variant === "compact" ? 90 : 120,
        repeat: Infinity,
        ease: "linear",
      }
    );

    return () => {
      animationRef.current?.stop();
    };
  }, [variant]);

  // Pause on hover
  const handleMouseEnter = () => animationRef.current?.pause();
  const handleMouseLeave = () => animationRef.current?.play();

  const height = variant === "compact" ? "h-72" : "h-96";

  return (
    <div
      className={`${height} w-full overflow-hidden`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={trackRef}
        className="flex items-center gap-6 py-4"
        style={{ willChange: "transform" }}
      >
        {images.map((image, i) => (
          <GalleryCard key={`${image.src}-${i}`} image={image} index={i} />
        ))}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  centered = true,
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(centered && "text-center", "mb-12", className)}>
      <h2
        className={cn(
          "text-3xl font-heading uppercase tracking-tight sm:text-4xl lg:text-5xl",
          light ? "text-cream" : "text-primary"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-lg font-sans",
            centered && "mx-auto",
            light ? "text-cream/70" : "text-muted-foreground"
          )}
        >
          {subtitle}
        </p>
      )}
      <hr
        className={cn(
          "mt-4 border-t",
          light ? "border-cream/20" : "border-border"
        )}
      />
    </div>
  );
}

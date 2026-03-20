"use client";

import { motion } from "motion/react";
import { Fish, Waves, Trophy, Bus } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Program } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  fish: Fish,
  waves: Waves,
  trophy: Trophy,
  bus: Bus,
};

interface ProgramsGridProps {
  programs: Program[];
}

export function ProgramsGrid({ programs }: ProgramsGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {programs.map((program, index) => {
        const Icon = iconMap[program.icon] || Fish;

        return (
          <motion.div
            key={program.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.5,
              delay: index * 0.12,
              ease: "easeOut",
            }}
          >
            <Card className="group h-full rounded-sm bg-cream shadow-sharp transition-shadow ring-1 ring-border">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-sm bg-rust/10 text-rust transition-colors group-hover:bg-rust group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{program.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <CardDescription className="leading-relaxed">
                  {program.description}
                </CardDescription>
                <Badge variant="secondary" className="bg-ink/10 text-ink text-xs">
                  {program.stats}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

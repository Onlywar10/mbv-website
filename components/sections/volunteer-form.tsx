"use client";

import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { CheckCircle, Send } from "lucide-react";

export function VolunteerForm() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(formData: FormData): Record<string, string> {
    const errs: Record<string, string> = {};
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    if (!name || name.trim().length < 2) {
      errs.name = "Please enter your name.";
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Please enter a valid email address.";
    }
    return errs;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const validationErrors = validate(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rust/10">
              <CheckCircle className="h-8 w-8 text-rust" />
            </div>
            <h3 className="text-2xl font-bold text-primary">
              Thank You for Signing Up!
            </h3>
            <p className="text-muted-foreground">
              We&apos;ve received your volunteer interest form. A member of our
              team will reach out to you within a few days with next steps and
              upcoming opportunities. We appreciate your willingness to serve!
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="volunteer-form" className="bg-muted py-20">
      <div className="mx-auto max-w-3xl px-6">
        <ScrollReveal>
          <SectionHeading
            title="Sign Up to Volunteer"
            subtitle="Fill out the form below and we'll connect you with opportunities that match your interests"
          />
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6 rounded-sm bg-card p-6 ring-1 ring-border sm:p-8"
          >
            {/* Name & Email row */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  aria-invalid={!!errors.name}
                  className="h-10"
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  aria-invalid={!!errors.email}
                  className="h-10"
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Phone & Availability row */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(831) 555-0123"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Input
                  id="availability"
                  name="availability"
                  placeholder="Weekends, weekday mornings, etc."
                  className="h-10"
                />
              </div>
            </div>

            {/* Interests */}
            <div className="space-y-2">
              <Label htmlFor="interests">Areas of Interest</Label>
              <Textarea
                id="interests"
                name="interests"
                placeholder="e.g., Fishing trip crew, Laguna Seca events, Pebble Beach golf, community outreach..."
                rows={3}
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Additional Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Tell us a little about yourself, your experience, or anything we should know..."
                rows={4}
              />
            </div>

            <Button type="submit" size="lg" className="h-11 w-full rounded-sm bg-rust font-heading uppercase tracking-wider text-cream hover:bg-rust-light sm:w-auto">
              <Send className="mr-2 h-4 w-4" />
              Submit Volunteer Interest
            </Button>
          </form>
        </ScrollReveal>
      </div>
    </section>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";

import { Brand } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/aura-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Welcome to Aura — AI Content Studio" },
      {
        name: "description",
        content: "Create polished content, refine your ideas and work smarter with AI.",
      },
      { property: "og:title", content: "Welcome to Aura — AI Content Studio" },
      { property: "og:description", content: "Your ideas. Your voice. Enhanced by AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WelcomePage,
});

function WelcomePage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      {/* soft flowing shapes */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 size-[28rem] rounded-full bg-rose/25 blur-3xl" />
        <div className="absolute -bottom-40 right-[-8rem] size-[32rem] rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute left-1/3 top-1/2 size-72 rounded-full bg-secondary/70 blur-3xl" />
        <Sparkles className="absolute left-[12%] top-[28%] size-4 text-gold/70" strokeWidth={1.5} />
        <Sparkles className="absolute right-[18%] top-[14%] size-5 text-rose/70" strokeWidth={1.5} />
        <Sparkles className="absolute bottom-[16%] left-[46%] size-3 text-gold/60" strokeWidth={1.5} />
      </div>

      <header className="relative z-10 flex justify-center pt-10">
        <Brand centered />
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="space-y-6 text-center lg:text-left">
          <h1 className="text-5xl sm:text-6xl">Welcome to Aura.</h1>
          <p className="font-display text-2xl text-primary sm:text-3xl">
            Your ideas. Your voice. Enhanced by AI.
          </p>
          <p className="mx-auto max-w-md text-base leading-relaxed text-muted-foreground lg:mx-0">
            Create polished content, refine your ideas and work smarter with AI.
          </p>
          <div className="flex flex-col items-center gap-4 pt-2 sm:flex-row sm:justify-center lg:justify-start">
            <Button asChild size="lg" className="px-8">
              <Link to="/dashboard">
                Get Started
                <ArrowRight className="size-4" strokeWidth={1.75} />
              </Link>
            </Button>
            <Link
              to="/about"
              className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Explore Aura
            </Link>
          </div>
        </div>

        <div className="relative">
          <div aria-hidden className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-rose/30 via-transparent to-gold/30 blur-xl" />
          <div className="surface-card relative overflow-hidden p-2">
            <img
              src={heroImage}
              alt="Illustration of a young Black woman in tech wearing headphones, working on a laptop surrounded by soft AI sparkles"
              className="h-72 w-full rounded-xl object-cover object-[70%_center] sm:h-96 lg:h-[28rem]"
            />
          </div>
          <div className="surface-card absolute -bottom-4 left-4 flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-gold" strokeWidth={1.75} />
            Drafting your LinkedIn post…
          </div>
        </div>
      </main>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, Heart, Lightbulb, PenLine, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import welcomeBg from "@/assets/aura-hero.jpg";

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

const CHIPS = [
  { label: "Ideas", icon: Lightbulb },
  { label: "Create", icon: PenLine },
  { label: "Grow", icon: BarChart3 },
];

function WelcomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <img
        src={welcomeBg}
        alt="Young Black woman in glasses and cream headphones working on a laptop in a warm, sunlit studio"
        width={1920}
        height={832}
        className="absolute inset-0 hidden h-full w-full object-cover object-right md:block"
      />
      <div
        aria-hidden
        className="absolute inset-0 hidden bg-gradient-to-r from-background/40 via-background/20 to-transparent md:block"
      />

      {/* sparkles */}
      <Sparkles aria-hidden className="absolute left-[8%] top-[28%] size-5 text-gold" strokeWidth={1.25} />
      <Sparkles aria-hidden className="absolute left-[52%] top-[18%] size-6 text-gold" strokeWidth={1.25} />
      <Sparkles aria-hidden className="absolute bottom-[18%] left-[46%] hidden size-5 text-background md:block" strokeWidth={1.25} />

      {/* script note */}
      <p
        aria-hidden
        className="absolute bottom-[26%] left-[7%] hidden -rotate-12 font-display text-lg italic leading-snug text-primary lg:block"
      >
        Better Content
        <br />
        Brighter Opportunities
        <Heart className="ml-2 inline size-3.5" strokeWidth={1.5} />
      </p>

      {/* floating chips */}
      <div className="absolute right-[4%] top-[26%] hidden flex-col gap-2 rounded-xl border border-background/60 bg-background/35 p-2 backdrop-blur-md lg:flex">
        {CHIPS.map((c) => (
          <span key={c.label} className="flex items-center gap-2 px-2 py-1 text-xs text-foreground/80">
            <c.icon className="size-3.5" strokeWidth={1.75} />
            {c.label}
          </span>
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col md:w-[62%]">
        <header className="flex justify-center pt-10">
          <Link
            to="/"
            aria-label="Aura home"
            className="group flex items-center gap-3 transition-all duration-300 hover:opacity-90"
          >
            <Sparkles
              className="size-9 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_var(--gold)]"
              strokeWidth={1.25}
            />
            <span className="leading-none">
              <span className="block font-display text-3xl">Aura</span>
              <span className="mt-1 block text-[0.65rem] tracking-[0.2em] text-foreground/70 uppercase">
                Content Studio
              </span>
            </span>
          </Link>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-12 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl">Welcome to Aura.</h1>
          <p className="text-lg text-foreground/85 sm:text-xl">
            Your ideas. Your voice. Enhanced by AI.
          </p>
          <Button asChild size="lg" className="mt-2 rounded-full px-8 shadow-soft">
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
        </main>

        <img
          src={welcomeBg}
          alt=""
          aria-hidden
          className="h-72 w-full object-cover object-[85%_center] md:hidden"
        />
      </div>
    </div>
  );
}

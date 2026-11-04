import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowUp, BookOpen, LayoutDashboard, Pencil, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home — Aura AI Content Studio" },
      {
        name: "description",
        content: "Create high-quality content in your voice, faster than ever, with Aura AI.",
      },
      { property: "og:title", content: "Home — Aura AI Content Studio" },
      {
        property: "og:description",
        content: "Create high-quality content in your voice, faster than ever.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const CARDS = [
  { label: "Generate new content", to: "/generate", icon: Pencil },
  { label: "View your dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Explore prompt library", to: "/prompts", icon: BookOpen },
  { label: "Enhance your ideas", to: "/saved", icon: Sparkles },
] as const;

function HomePage() {
  const navigate = useNavigate();
  const [idea, setIdea] = useState("");

  const go = () => {
    const topic = idea.trim();
    if (!topic) {
      navigate({ to: "/generate" });
      return;
    }
    navigate({ to: "/generate", search: { topic } });
  };

  return (
    <div className="mx-auto w-full max-w-3xl pb-10">
      <header className="pt-4 text-center sm:pt-8">
        <h1 className="text-4xl sm:text-5xl">Welcome to Aura</h1>
        <p className="mt-2 font-display text-2xl text-primary sm:text-3xl">AI Content Studio</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          Create high-quality content in your voice, faster than ever.
        </p>
      </header>

      <div className="mt-8 sm:mt-10">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            go();
          }}
          className="flex items-center gap-2 rounded-full border border-border bg-card py-2 pl-6 pr-2 shadow-soft"
        >
          <input
            value={idea}
            onChange={(event) => setIdea(event.target.value)}
            placeholder="What do you want to create today?"
            aria-label="What do you want to create today?"
            className="h-11 min-w-0 flex-1 bg-transparent font-display text-base text-foreground outline-none placeholder:text-muted-foreground/80 sm:text-lg"
          />
          <Button
            type="submit"
            size="icon"
            aria-label="Start creating"
            className="size-12 shrink-0 rounded-full"
          >
            <ArrowUp className="size-5" strokeWidth={2} />
          </Button>
        </form>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl sm:text-2xl">Get started</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {CARDS.map((card) => (
            <button
              key={card.to}
              type="button"
              onClick={() => navigate({ to: card.to })}
              className="surface-card group flex flex-col items-center gap-4 rounded-2xl px-4 py-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
            >
              <span className="flex size-12 items-center justify-center rounded-xl text-primary transition-transform duration-300 group-hover:scale-110">
                <card.icon className="size-7" strokeWidth={1.5} />
              </span>
              <span className="text-sm leading-snug">{card.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

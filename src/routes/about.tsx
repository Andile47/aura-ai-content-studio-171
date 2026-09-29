import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Aura — AI Content Studio" },
      {
        name: "description",
        content:
          "Aura is a portfolio project exploring prompt design, AI content generation and productivity workflows.",
      },
      { property: "og:title", content: "About Aura — AI Content Studio" },
      {
        property: "og:description",
        content: "Why Aura exists, who it is for, and what it demonstrates.",
      },
    ],
  }),
  component: AboutPage,
});

const PILLARS = [
  {
    title: "Prompt optimisation",
    body: "Every content type carries its own structural brief, so the output arrives shaped rather than generic.",
  },
  {
    title: "Content structuring",
    body: "Captions, posts, emails, articles and study notes each follow the format readers expect.",
  },
  {
    title: "Productivity workflow",
    body: "Generate, refine, shorten, expand and save — the loop a real writing session actually needs.",
  },
];

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Built to remove the blank page."
        description="Aura shows how thoughtful prompt design turns a rough idea into content someone would genuinely publish."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {PILLARS.map((pillar) => (
          <div key={pillar.title} className="surface-card p-5">
            <h2 className="text-lg">{pillar.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
          </div>
        ))}
      </div>

      <div className="surface-card mt-6 space-y-4 p-6 sm:p-8">
        <h2 className="text-2xl">Who it is for</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Students writing summaries, young professionals building a presence, creators feeding a
          content calendar, and small business owners who write their own marketing. Aura gives each
          of them a strong first draft in their own voice, with the controls to adjust tone, audience
          and length before anything gets published.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          This first version focuses on the content generation workflow, the prompt library, saved
          content and the dashboard. The architecture stays modular so further AI features can be
          layered on later.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild>
            <Link to="/generate">Start Creating</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/prompts">Explore Prompts</Link>
          </Button>
        </div>
      </div>
    </>
  );
}

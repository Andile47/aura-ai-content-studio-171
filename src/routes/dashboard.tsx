import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Sparkles, TrendingUp } from "lucide-react";

import { ContentCard } from "@/components/ContentCard";
import { Button } from "@/components/ui/button";
import { contentTypeLabel, countWords } from "@/lib/content";
import { PROMPT_LIBRARY } from "@/lib/prompts";
import { useHistory, useSavedContent, useSavedPrompts } from "@/lib/store";
import heroImage from "@/assets/aura-hero.jpg";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Aura AI Content Studio — Create with intention" },
      {
        name: "description",
        content:
          "Turn your ideas into polished captions, posts, emails, articles and study notes with Aura's AI content studio.",
      },
      { property: "og:title", content: "Aura AI Content Studio — Create with intention" },
      {
        property: "og:description",
        content: "Your ideas. Your voice. Enhanced by AI.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { history } = useHistory();
  const { saved } = useSavedContent();
  const { promptIds } = useSavedPrompts();

  const savedPrompts = PROMPT_LIBRARY.filter((p) => promptIds.includes(p.id));
  const totalWords = history.reduce((sum, item) => sum + countWords(item.content), 0);
  const favouriteTypes = Object.entries(
    history.reduce<Record<string, number>>((acc, item) => {
      acc[item.contentType] = (acc[item.contentType] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const stats = [
    { label: "Pieces generated", value: history.length },
    { label: "Words written", value: totalWords.toLocaleString() },
    { label: "Saved drafts", value: saved.length },
    { label: "Saved prompts", value: savedPrompts.length },
  ];

  return (
    <>
      <section className="warm-panel surface-card relative overflow-hidden p-6 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-5">
            <p className="text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase">
              Welcome back
            </p>
            <h1 className="text-4xl sm:text-5xl">Create with intention.</h1>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
              Turn your ideas into polished content with AI.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/generate">
                  <Sparkles className="size-4" strokeWidth={1.75} />
                  Start Creating
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/prompts">
                  <BookOpen className="size-4" strokeWidth={1.75} />
                  Explore Prompts
                </Link>
              </Button>
            </div>
            <p className="text-xs tracking-wide text-muted-foreground">
              Your ideas. Your voice. Enhanced by AI.
            </p>
          </div>
          <img
            src={heroImage}
            alt="Illustration of a young Black woman in tech wearing headphones, working on a laptop surrounded by soft AI sparkles"
            className="h-48 w-full rounded-2xl object-cover object-[70%_center] sm:h-60 lg:h-72"
          />
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="surface-card p-5">
            <p className="font-display text-3xl">{stat.value}</p>
            <p className="mt-1 text-xs tracking-wide text-muted-foreground uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">Recently generated</h2>
            <Link
              to="/saved"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Saved content
              <ArrowRight className="size-3" strokeWidth={1.75} />
            </Link>
          </div>
          {history.slice(0, 3).map((item) => (
            <div key={item.id} className="space-y-2">
              <p className="text-sm text-muted-foreground">{item.topic}</p>
              <ContentCard
                content={item.content}
                meta={`${contentTypeLabel(item.contentType)} · ${item.tone} · ${new Date(
                  item.createdAt,
                ).toLocaleDateString()}`}
              />
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="surface-card p-5">
            <h2 className="text-xl">Saved prompts</h2>
            <div className="mt-4 space-y-3">
              {savedPrompts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Bookmark a prompt in the library and it will appear here.
                </p>
              ) : (
                savedPrompts.map((prompt) => (
                  <Link
                    key={prompt.id}
                    to="/generate"
                    search={{ topic: prompt.text, type: prompt.contentType }}
                    className="block rounded-lg border border-border bg-secondary/40 px-4 py-3 transition-colors hover:border-primary"
                  >
                    <p className="text-sm">{prompt.name}</p>
                    <p className="text-xs text-muted-foreground">{prompt.category}</p>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="surface-card p-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" strokeWidth={1.75} />
              <h2 className="text-xl">Favourite content types</h2>
            </div>
            <div className="mt-4 space-y-3">
              {favouriteTypes.length === 0 ? (
                <p className="text-sm text-muted-foreground">Generate something to see patterns.</p>
              ) : (
                favouriteTypes.map(([type, count]) => {
                  const max = favouriteTypes[0]?.[1] ?? 1;
                  return (
                    <div key={type} className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span>{contentTypeLabel(type)}</span>
                        <span className="text-muted-foreground">{count}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${(count / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

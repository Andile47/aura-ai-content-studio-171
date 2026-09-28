import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, Copy, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { PROMPT_CATEGORIES, PROMPT_LIBRARY } from "@/lib/prompts";
import { useSavedPrompts } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/prompts")({
  head: () => ({
    meta: [
      { title: "Prompt Library — Aura AI Content Studio" },
      {
        name: "description",
        content:
          "Ready-made prompts for LinkedIn posts, professional emails, captions, blog intros, study summaries and marketing content.",
      },
      { property: "og:title", content: "Prompt Library — Aura AI Content Studio" },
      {
        property: "og:description",
        content: "Copy a proven prompt or send it straight into the Aura generator.",
      },
    ],
  }),
  component: PromptLibraryPage,
});

function PromptLibraryPage() {
  const [category, setCategory] = useState<string>("All");
  const navigate = useNavigate();
  const { promptIds, toggle } = useSavedPrompts();

  const prompts =
    category === "All" ? PROMPT_LIBRARY : PROMPT_LIBRARY.filter((p) => p.category === category);

  return (
    <>
      <PageHeader
        eyebrow="Prompt Library"
        title="Start from something proven."
        description="Sixteen prompts for the writing you do most often. Copy one, or send it straight into the generator."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {["All", ...PROMPT_CATEGORIES].map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs transition-colors duration-200",
              category === item
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {prompts.map((prompt) => {
          const savedPrompt = promptIds.includes(prompt.id);
          return (
            <article key={prompt.id} className="surface-card flex flex-col gap-4 p-5">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg leading-snug">{prompt.name}</h2>
                  <button
                    aria-label={savedPrompt ? "Remove saved prompt" : "Save prompt"}
                    onClick={() => toggle(prompt.id)}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {savedPrompt ? (
                      <BookmarkCheck className="size-4 text-primary" strokeWidth={1.75} />
                    ) : (
                      <Bookmark className="size-4" strokeWidth={1.75} />
                    )}
                  </button>
                </div>
                <p className="text-[0.7rem] tracking-[0.16em] text-muted-foreground uppercase">
                  {prompt.category}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">{prompt.description}</p>
              </div>

              <p className="rounded-lg bg-secondary/60 px-4 py-3 text-sm leading-relaxed">
                {prompt.text}
              </p>

              <div className="mt-auto flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(prompt.text);
                      toast.success("Prompt copied");
                    } catch {
                      toast.error("Copying isn't available in this browser");
                    }
                  }}
                >
                  <Copy className="size-3.5" strokeWidth={1.75} />
                  Copy prompt
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    navigate({
                      to: "/generate",
                      search: { topic: prompt.text, type: prompt.contentType },
                    })
                  }
                >
                  <Wand2 className="size-3.5" strokeWidth={1.75} />
                  Use prompt
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

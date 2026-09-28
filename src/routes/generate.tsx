import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ContentCard, type ContentCardAction } from "@/components/ContentCard";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AUDIENCES, CONTENT_TYPES, LENGTHS, TONES, contentTypeLabel } from "@/lib/content";
import { generateContent, refineContent } from "@/lib/generate.functions";
import { useHistory, useSavedContent, type GenerationRecord } from "@/lib/store";

type Search = { topic?: string | undefined; type?: string | undefined };

export const Route = createFileRoute("/generate")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    topic: typeof search["topic"] === "string" ? search["topic"] : undefined,
    type: typeof search["type"] === "string" ? search["type"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Generate Content — Aura AI Content Studio" },
      {
        name: "description",
        content:
          "Turn an idea into a polished caption, post, email, blog or study summary with Aura's AI content generator.",
      },
      { property: "og:title", content: "Generate Content — Aura AI Content Studio" },
      {
        property: "og:description",
        content: "Choose your content type, audience and tone, then generate publish-ready writing.",
      },
    ],
  }),
  component: GeneratePage,
});

function GeneratePage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const generate = useServerFn(generateContent);
  const refine = useServerFn(refineContent);
  const { addHistory } = useHistory();
  const { save } = useSavedContent();

  const [topic, setTopic] = useState(search.topic ?? "");
  const [contentType, setContentType] = useState(search.type ?? "linkedin-post");
  const [audience, setAudience] = useState<string>(AUDIENCES[0]);
  const [tone, setTone] = useState<string>(TONES[0]);
  const [length, setLength] = useState<string>(LENGTHS[1]);
  const [keywords, setKeywords] = useState("");
  const [callToAction, setCallToAction] = useState("");

  const [result, setResult] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<ContentCardAction | null>(null);
  const [generating, setGenerating] = useState(false);

  const makeRecord = (content: string): GenerationRecord => ({
    id: `${Date.now()}`,
    topic,
    contentType,
    audience,
    tone,
    length,
    content,
    createdAt: new Date().toISOString(),
  });

  const runGenerate = async () => {
    if (topic.trim().length < 3) {
      toast.error("Tell Aura a little more about your idea first");
      return;
    }
    setGenerating(true);
    try {
      const { content } = await generate({
        data: {
          topic: topic.trim(),
          contentType,
          audience,
          tone,
          length,
          keywords: keywords.trim() || undefined,
          callToAction: callToAction.trim() || undefined,
        },
      });
      setResult(content);
      addHistory(makeRecord(content));
      if (search.topic || search.type) navigate({ to: "/generate", search: {}, replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setGenerating(false);
    }
  };

  const handleAction = async (action: ContentCardAction) => {
    if (action === "regenerate") {
      setBusyAction("regenerate");
      await runGenerate();
      setBusyAction(null);
      return;
    }
    if (!result) return;
    setBusyAction(action);
    try {
      const { content } = await refine({ data: { content: result, action, tone, audience } });
      setResult(content);
      addHistory(makeRecord(content));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Generate"
        title="Create with intention."
        description="Describe your idea, shape the delivery, and let Aura draft content you can publish."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start">
        <section className="surface-card space-y-5 p-5 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic or idea</Label>
            <Textarea
              id="topic"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="e.g. A LinkedIn post about finishing my first AI portfolio project"
              className="min-h-28 resize-y bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label>Content type</Label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Target audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AUDIENCES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Length</Label>
            <Select value={length} onValueChange={setLength}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LENGTHS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (optional)</Label>
              <Input
                id="keywords"
                value={keywords}
                onChange={(event) => setKeywords(event.target.value)}
                placeholder="prompt design, portfolio"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta">Call to action (optional)</Label>
              <Input
                id="cta"
                value={callToAction}
                onChange={(event) => setCallToAction(event.target.value)}
                placeholder="Invite feedback in the comments"
                className="bg-background"
              />
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={runGenerate} disabled={generating}>
            {generating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" strokeWidth={1.75} />
            )}
            {generating ? "Writing…" : "Generate"}
          </Button>
        </section>

        <section className="space-y-4">
          {result ? (
            <ContentCard
              content={result}
              meta={`${contentTypeLabel(contentType)} · ${tone} · ${audience}`}
              busyAction={busyAction}
              onAction={handleAction}
              onSave={() => {
                const added = save(makeRecord(result));
                toast[added ? "success" : "info"](
                  added ? "Saved to your library" : "This is already in Saved Content",
                );
              }}
              onClear={() => setResult(null)}
            />
          ) : (
            <div className="surface-card flex min-h-72 flex-col items-center justify-center gap-3 p-8 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-secondary">
                <Sparkles className="size-5 text-primary" strokeWidth={1.75} />
              </span>
              <h2 className="text-xl">Your draft will appear here</h2>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                Fill in your idea and press Generate. You can then refine, shorten, expand or save
                the result.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

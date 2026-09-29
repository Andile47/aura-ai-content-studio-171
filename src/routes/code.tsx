import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Loader2, Trash2, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { generateCode } from "@/lib/generate.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/code")({
  head: () => ({
    meta: [
      { title: "Generate Code — Aura AI Content Studio" },
      {
        name: "description",
        content: "Describe what you need and Aura writes clean, commented code with a plain-language explanation.",
      },
      { property: "og:title", content: "Generate Code — Aura AI Content Studio" },
      { property: "og:description", content: "Turn a plain description into working, explained code." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CodePage,
});

const LANGUAGES = ["JavaScript", "TypeScript", "Python", "HTML & CSS", "SQL", "Java", "C#", "PHP"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

function CodePage() {
  const run = useServerFn(generateCode);
  const [request, setRequest] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [level, setLevel] = useState("Beginner");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ code: string; explanation: string } | null>(null);

  async function submit() {
    if (request.trim().length < 3) {
      toast.error("Describe what the code should do first");
      return;
    }
    setLoading(true);
    try {
      setResult(await run({ data: { request, language, level } }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-3.5 py-1.5 text-xs transition-colors duration-200",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-card text-muted-foreground hover:text-foreground",
    );

  return (
    <>
      <PageHeader
        eyebrow="Generate Code"
        title="Describe it. Get working code."
        description="Explain what you want in plain words. Aura writes clean, commented code and tells you how it works."
      />

      <div className="surface-card space-y-5 p-5 sm:p-6">
        <div className="space-y-2">
          <label htmlFor="req" className="text-sm font-medium">What should the code do?</label>
          <textarea
            id="req"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            rows={4}
            placeholder="e.g. A function that checks whether an email address looks valid"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Language</p>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <button key={l} onClick={() => setLanguage(l)} className={chip(language === l)}>{l}</button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Explain it for</p>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <button key={l} onClick={() => setLevel(l)} className={chip(level === l)}>{l}</button>
            ))}
          </div>
        </div>
        <Button onClick={submit} disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" strokeWidth={1.75} />}
          {loading ? "Writing code…" : "Generate code"}
        </Button>
      </div>

      {result ? (
        <div className="surface-card mt-6 space-y-4 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg">{language}</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(result.code);
                    toast.success("Code copied");
                  } catch {
                    toast.error("Copying isn't available in this browser");
                  }
                }}
              >
                <Copy className="size-3.5" strokeWidth={1.75} /> Copy code
              </Button>
              <Button variant="outline" size="sm" onClick={() => setResult(null)}>
                <Trash2 className="size-3.5" strokeWidth={1.75} /> Clear
              </Button>
            </div>
          </div>
          <pre className="overflow-x-auto rounded-lg bg-foreground p-4 text-xs leading-relaxed text-background">
            <code>{result.code}</code>
          </pre>
          {result.explanation ? (
            <div className="whitespace-pre-wrap rounded-lg bg-secondary/60 px-4 py-3 text-sm leading-relaxed">
              {result.explanation}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";

import { ContentCard } from "@/components/ContentCard";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { contentTypeLabel } from "@/lib/content";
import { useSavedContent } from "@/lib/store";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved Content — Aura AI Content Studio" },
      {
        name: "description",
        content: "Your kept drafts, captions, emails and notes — ready to copy and publish.",
      },
      { property: "og:title", content: "Saved Content — Aura AI Content Studio" },
      {
        property: "og:description",
        content: "Revisit and reuse the content you decided to keep.",
      },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { saved, remove } = useSavedContent();

  return (
    <>
      <PageHeader
        eyebrow="Saved Content"
        title="Everything worth keeping."
        description="Drafts you saved from the studio, with word counts and the settings that produced them."
        actions={
          <Button asChild>
            <Link to="/generate">Create something new</Link>
          </Button>
        }
      />

      {saved.length === 0 ? (
        <div className="surface-card flex flex-col items-center justify-center gap-3 p-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-secondary">
            <Bookmark className="size-5 text-primary" strokeWidth={1.75} />
          </span>
          <h2 className="text-xl">Nothing saved yet</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Generate a draft you like and press Save — it will live here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {saved.map((item) => (
            <div key={item.id} className="space-y-2">
              <p className="text-sm text-muted-foreground">{item.topic}</p>
              <ContentCard
                content={item.content}
                meta={`${contentTypeLabel(item.contentType)} · ${item.tone} · ${new Date(
                  item.createdAt,
                ).toLocaleDateString()}`}
                onClear={() => {
                  remove(item.id);
                  toast.success("Removed from Saved Content");
                }}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

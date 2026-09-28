import {
  Copy,
  RefreshCw,
  Wand2,
  Minimize2,
  Maximize2,
  Bookmark,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { countWords } from "@/lib/content";

export type ContentCardAction = "regenerate" | "improve" | "shorten" | "expand";

export function ContentCard({
  content,
  meta,
  busyAction,
  onAction,
  onSave,
  onClear,
}: {
  content: string;
  meta: string;
  busyAction?: ContentCardAction | null;
  onAction?: (action: ContentCardAction) => void;
  onSave?: () => void;
  onClear?: () => void;
}) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copying isn't available in this browser");
    }
  };

  const busy = Boolean(busyAction);

  const actionButton = (action: ContentCardAction, label: string, Icon: typeof Wand2) => (
    <Button
      variant="outline"
      size="sm"
      disabled={busy}
      onClick={() => onAction?.(action)}
    >
      {busyAction === action ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Icon className="size-3.5" strokeWidth={1.75} />
      )}
      {label}
    </Button>
  );

  return (
    <article className="surface-card overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/50 px-5 py-4">
        <p className="text-xs text-muted-foreground">{meta}</p>
        <p className="text-xs text-muted-foreground">{countWords(content)} words</p>
      </header>

      <div className="px-5 py-6 text-[0.95rem] leading-relaxed whitespace-pre-wrap">{content}</div>

      <footer className="flex flex-wrap gap-2 border-t border-border bg-secondary/40 px-5 py-4">
        <Button size="sm" onClick={copy}>
          <Copy className="size-3.5" strokeWidth={1.75} />
          Copy
        </Button>
        {onAction ? (
          <>
            {actionButton("regenerate", "Regenerate", RefreshCw)}
            {actionButton("improve", "Improve", Wand2)}
            {actionButton("shorten", "Shorten", Minimize2)}
            {actionButton("expand", "Expand", Maximize2)}
          </>
        ) : null}
        {onSave ? (
          <Button variant="outline" size="sm" disabled={busy} onClick={onSave}>
            <Bookmark className="size-3.5" strokeWidth={1.75} />
            Save
          </Button>
        ) : null}
        {onClear ? (
          <Button variant="ghost" size="sm" disabled={busy} onClick={onClear}>
            <Trash2 className="size-3.5" strokeWidth={1.75} />
            Clear
          </Button>
        ) : null}
      </footer>
    </article>
  );
}

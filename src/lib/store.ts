import { useCallback, useEffect, useState } from "react";

export type GenerationRecord = {
  id: string;
  topic: string;
  contentType: string;
  audience: string;
  tone: string;
  length: string;
  content: string;
  createdAt: string;
  saved?: boolean;
};

const HISTORY_KEY = "aura.history.v1";
const SAVED_KEY = "aura.saved.v1";
const PROMPTS_KEY = "aura.savedPrompts.v1";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("aura:store"));
  } catch {
    /* storage unavailable */
  }
}

function useStoredList<T>(key: string, seed: T[]) {
  const [items, setItems] = useState<T[]>(seed);

  const sync = useCallback(() => {
    const stored = read<T[] | null>(key, null);
    if (stored === null) {
      write(key, seed);
      setItems(seed);
    } else {
      setItems(stored);
    }
  }, [key, seed]);

  useEffect(() => {
    sync();
    const handler = () =>
      setItems((current) => {
        const next = read<T[]>(key, seed);
        return JSON.stringify(next) === JSON.stringify(current) ? current : next;
      });
    window.addEventListener("aura:store", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("aura:store", handler);
      window.removeEventListener("storage", handler);
    };
  }, [key, seed, sync]);

  const update = useCallback(
    (next: T[]) => {
      write(key, next);
      setItems(next);
    },
    [key],
  );

  return [items, update] as const;
}

export const SAMPLE_HISTORY: GenerationRecord[] = [
  {
    id: "sample-1",
    topic: "Announcing my final-year portfolio project",
    contentType: "linkedin-post",
    audience: "Recruiters & hiring managers",
    tone: "Confident",
    length: "Medium",
    content:
      "Six weeks ago I had a messy idea and a blank document.\n\nToday I'm sharing Aura — a content studio that turns rough ideas into polished writing.\n\nWhat I learned building it:\n\n1. Prompt design is product design. The clearer the input, the more useful the output.\n2. Structure beats volume. People want content they can publish, not paragraphs they must fix.\n3. Shipping something small and real teaches more than planning something big.\n\nIf you're building in AI productivity, I'd love to hear what you're working on.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "sample-2",
    topic: "Weekend sale for a small handmade candle brand",
    contentType: "social-caption",
    audience: "Clients & customers",
    tone: "Warm",
    length: "Short",
    content:
      "Slow mornings deserve better light.\n\nOur hand-poured cream and amber candles are 20% off this weekend only — small batch, long burn, quietly beautiful.\n\nTap the link to choose your scent before Sunday.\n\n#handmadecandles #slowliving #smallbusiness #homescent",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: "sample-3",
    topic: "Study notes on supervised vs unsupervised learning",
    contentType: "study-notes",
    audience: "Students",
    tone: "Educational",
    length: "Medium",
    content:
      "Definition: Supervised learning trains on labelled examples; unsupervised learning finds structure in unlabelled data.\n\nKey points\n• Supervised needs input-output pairs; unsupervised needs only inputs.\n• Classification and regression are supervised tasks.\n• Clustering and dimensionality reduction are unsupervised tasks.\n• Labels are expensive, which is why unsupervised methods scale cheaply.\n• Accuracy is measurable in supervised work; unsupervised results need interpretation.\n\nExample: Predicting a house price from size is supervised. Grouping customers by behaviour is unsupervised.\n\nSelf-test\n1. Which type needs labels? — Supervised.\n2. Is clustering supervised? — No.\n3. Why is labelling a bottleneck? — It requires human time and expertise.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
  },
];

export const SAMPLE_SAVED: GenerationRecord[] = [
  { ...SAMPLE_HISTORY[0]!, id: "saved-1", saved: true },
  { ...SAMPLE_HISTORY[1]!, id: "saved-2", saved: true },
];

export function useHistory() {
  const [history, setHistory] = useStoredList<GenerationRecord>(HISTORY_KEY, SAMPLE_HISTORY);
  const addHistory = useCallback(
    (record: GenerationRecord) => setHistory([record, ...read<GenerationRecord[]>(HISTORY_KEY, SAMPLE_HISTORY)].slice(0, 30)),
    [setHistory],
  );
  return { history, addHistory, setHistory };
}

export function useSavedContent() {
  const [saved, setSaved] = useStoredList<GenerationRecord>(SAVED_KEY, SAMPLE_SAVED);
  const save = useCallback(
    (record: GenerationRecord) => {
      const current = read<GenerationRecord[]>(SAVED_KEY, SAMPLE_SAVED);
      if (current.some((item) => item.content === record.content)) return false;
      setSaved([{ ...record, saved: true }, ...current]);
      return true;
    },
    [setSaved],
  );
  const remove = useCallback(
    (id: string) => setSaved(read<GenerationRecord[]>(SAVED_KEY, SAMPLE_SAVED).filter((item) => item.id !== id)),
    [setSaved],
  );
  return { saved, save, remove };
}

const SEED_PROMPT_IDS = ["linkedin-lesson", "study-summary"];

export function useSavedPrompts() {
  const [promptIds, setPromptIds] = useStoredList<string>(PROMPTS_KEY, SEED_PROMPT_IDS);
  const toggle = useCallback(
    (id: string) => {
      const current = read<string[]>(PROMPTS_KEY, []);
      setPromptIds(current.includes(id) ? current.filter((p) => p !== id) : [id, ...current]);
    },
    [setPromptIds],
  );
  return { promptIds, toggle };
}

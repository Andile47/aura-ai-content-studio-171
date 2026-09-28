export type ContentTypeId =
  | "social-caption"
  | "linkedin-post"
  | "professional-email"
  | "blog-post"
  | "marketing-copy"
  | "study-notes"
  | "content-ideas"
  | "code-explanation";

export const CONTENT_TYPES: { id: ContentTypeId; label: string; hint: string }[] = [
  { id: "social-caption", label: "Social Media Caption", hint: "Short, scroll-stopping copy" },
  { id: "linkedin-post", label: "LinkedIn Post", hint: "Professional storytelling" },
  { id: "professional-email", label: "Professional Email", hint: "Clear, courteous messages" },
  { id: "blog-post", label: "Blog Post", hint: "Structured long-form article" },
  { id: "marketing-copy", label: "Marketing Copy", hint: "Benefit-led persuasion" },
  { id: "study-notes", label: "Study Notes", hint: "Summaries you can revise from" },
  { id: "content-ideas", label: "Content Ideas", hint: "Fresh angles and hooks" },
  { id: "code-explanation", label: "Simple Code Explanation", hint: "Plain-language walkthroughs" },
];

export const TONES = [
  "Professional",
  "Friendly",
  "Confident",
  "Warm",
  "Educational",
  "Persuasive",
  "Casual",
  "Inspirational",
] as const;

export const LENGTHS = ["Short", "Medium", "Long"] as const;

export const AUDIENCES = [
  "General audience",
  "Students",
  "Young professionals",
  "Recruiters & hiring managers",
  "Small business owners",
  "Creators & freelancers",
  "Clients & customers",
  "Technical beginners",
] as const;

export type RefineAction = "improve" | "shorten" | "expand";

export function contentTypeLabel(id: string) {
  return CONTENT_TYPES.find((t) => t.id === id)?.label ?? id;
}

export function countWords(text: string) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

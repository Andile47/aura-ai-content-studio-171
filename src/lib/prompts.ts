import type { ContentTypeId } from "./content";

export type LibraryPrompt = {
  id: string;
  name: string;
  category: string;
  description: string;
  text: string;
  contentType: ContentTypeId;
};

export const PROMPT_LIBRARY: LibraryPrompt[] = [
  {
    id: "linkedin-lesson",
    name: "Career Lesson Post",
    category: "LinkedIn posts",
    description: "Turn a small work moment into a credible, human LinkedIn story.",
    text: "Write a LinkedIn post about a lesson I learned while [situation]. Open with a specific moment, explain what changed in how I work, and close with one takeaway other professionals can use.",
    contentType: "linkedin-post",
  },
  {
    id: "linkedin-project",
    name: "Project Announcement",
    category: "LinkedIn posts",
    description: "Share a finished project without sounding like a press release.",
    text: "Write a LinkedIn post announcing that I built [project]. Cover the problem it solves, the tools I used, one challenge I overcame, and invite thoughtful feedback.",
    contentType: "linkedin-post",
  },
  {
    id: "email-follow-up",
    name: "Polite Follow-Up",
    category: "Professional emails",
    description: "Nudge someone for a reply while keeping the relationship warm.",
    text: "Write a short professional follow-up email to [recipient] about [topic]. Reference our previous conversation, restate the one thing I need, and offer an easy next step.",
    contentType: "professional-email",
  },
  {
    id: "email-application",
    name: "Application Email",
    category: "Professional emails",
    description: "Introduce yourself for a role or opportunity in under 200 words.",
    text: "Write an application email for the [role] position at [company]. Highlight my experience in [skills], show why the company interests me, and end with a confident closing line.",
    contentType: "professional-email",
  },
  {
    id: "caption-launch",
    name: "Launch Caption",
    category: "Social media captions",
    description: "Announce something new with a hook and a clear action.",
    text: "Write three social media captions announcing [product or news]. Each should have a scroll-stopping first line, one benefit, and a clear call to action. Add 4 relevant hashtags.",
    contentType: "social-caption",
  },
  {
    id: "caption-behind-scenes",
    name: "Behind the Scenes",
    category: "Social media captions",
    description: "Build trust by showing process instead of polish.",
    text: "Write a warm behind-the-scenes caption about how I [process]. Keep it conversational, include one honest detail, and end with a question that invites replies.",
    contentType: "social-caption",
  },
  {
    id: "blog-intro",
    name: "Blog Introduction",
    category: "Blog introductions",
    description: "Open an article with a hook, a promise and a roadmap.",
    text: "Write an introduction for a blog post titled [title]. Start with a relatable tension, promise what the reader will gain, and outline the three sections that follow.",
    contentType: "blog-post",
  },
  {
    id: "study-summary",
    name: "Study Summary",
    category: "Study summaries",
    description: "Compress a topic into revision-ready notes.",
    text: "Summarise [topic] into study notes: a one-line definition, five key points, two worked examples, and three quick self-test questions with answers.",
    contentType: "study-notes",
  },
  {
    id: "study-explain",
    name: "Explain It Simply",
    category: "Study summaries",
    description: "Break a difficult concept down for a beginner.",
    text: "Explain [concept] to a complete beginner. Use one everyday analogy, then give the precise definition, then list two common misunderstandings.",
    contentType: "code-explanation",
  },
  {
    id: "marketing-benefits",
    name: "Benefit-Led Copy",
    category: "Marketing content",
    description: "Sell the outcome rather than the feature list.",
    text: "Write marketing copy for [product] aimed at [audience]. Lead with the outcome they want, translate three features into benefits, handle one objection, and close with a call to action.",
    contentType: "marketing-copy",
  },
  {
    id: "marketing-landing",
    name: "Landing Page Section",
    category: "Marketing content",
    description: "A headline, subline and supporting bullets for a page section.",
    text: "Write a landing page section for [offer]: a headline under 10 words, a two-line subheading, three supporting bullets, and one short trust statement.",
    contentType: "marketing-copy",
  },
  {
    id: "brainstorm-angles",
    name: "Ten Content Angles",
    category: "Brainstorming",
    description: "Get a month of ideas from a single topic.",
    text: "Give me ten content ideas about [topic] for [audience]. For each, include the angle, the format it suits best, and a one-line hook.",
    contentType: "content-ideas",
  },
  {
    id: "brainstorm-series",
    name: "Series Planner",
    category: "Brainstorming",
    description: "Turn one theme into a connected content series.",
    text: "Plan a five-part content series about [theme]. For each part give a title, the key message, and how it leads into the next part.",
    contentType: "content-ideas",
  },
  {
    id: "business-update",
    name: "Client Update",
    category: "Business communication",
    description: "Keep stakeholders informed without overwhelming them.",
    text: "Write a concise client update about [project]. Cover progress since last update, what is next, anything I need from them, and a realistic timeline.",
    contentType: "professional-email",
  },
  {
    id: "business-difficult",
    name: "Difficult Message",
    category: "Business communication",
    description: "Deliver a delay or a no with clarity and respect.",
    text: "Write a respectful message explaining [difficult news] to [recipient]. Be direct about the situation, take appropriate ownership, and offer a concrete solution.",
    contentType: "professional-email",
  },
  {
    id: "business-proposal",
    name: "Short Proposal",
    category: "Business communication",
    description: "Pitch scope, value and price in one readable page.",
    text: "Write a short proposal for [service] for [client]. Include their goal, my proposed approach in three steps, deliverables, timeline, and a closing line about next steps.",
    contentType: "marketing-copy",
  },
];

export const PROMPT_CATEGORIES = Array.from(new Set(PROMPT_LIBRARY.map((p) => p.category)));

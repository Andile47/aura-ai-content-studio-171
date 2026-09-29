import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const contentTypeGuides: Record<string, string> = {
  "social-caption":
    "Write a social media caption: a hook line, 2-4 short lines of body copy, one call to action, then 4-6 relevant hashtags on the final line.",
  "linkedin-post":
    "Write a LinkedIn post: a strong opening line, short punchy paragraphs with line breaks, a concrete insight or story, and a closing question or takeaway.",
  "professional-email":
    "Write a professional email with a 'Subject:' line, greeting, 1-3 tight paragraphs, a clear ask, and a sign-off placeholder like [Your name].",
  "blog-post":
    "Write a structured blog post with a title, short introduction, 3-5 subheadings with body paragraphs, and a conclusion.",
  "marketing-copy":
    "Write marketing copy: a headline, a subheading, benefit-led body copy, three supporting bullets, and a call to action.",
  "study-notes":
    "Write study notes: a one-line definition, key points as bullets, a worked example, and 3 self-test questions with answers.",
  "content-ideas":
    "Produce a numbered list of content ideas. For each: the angle, the best format, and a one-line hook.",
  "code-explanation":
    "Explain the code or concept in plain language: what it does, a step-by-step walkthrough, one everyday analogy, and a common mistake to avoid.",
};

const lengthGuides: Record<string, string> = {
  Short: "Keep it tight: roughly 60-120 words.",
  Medium: "Aim for roughly 150-280 words.",
  Long: "Go deeper: roughly 400-650 words.",
};

const generateSchema = z.object({
  topic: z.string().min(3).max(2000),
  contentType: z.string().min(1),
  audience: z.string().min(1),
  tone: z.string().min(1),
  length: z.string().min(1),
  keywords: z.string().max(400).optional(),
  callToAction: z.string().max(400).optional(),
});

const refineSchema = z.object({
  content: z.string().min(1).max(20000),
  action: z.enum(["improve", "shorten", "expand"]),
  tone: z.string().min(1),
  audience: z.string().min(1),
});

async function callGateway(system: string, user: string) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) {
    throw new Error("AI is not configured yet. Please try again in a moment.");
  }

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3.7-flash",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (response.status === 429) {
    throw new Error("Too many requests right now. Please wait a moment and try again.");
  }
  if (response.status === 402) {
    throw new Error("AI credits are exhausted. Please top up to keep generating.");
  }
  if (!response.ok) {
    const detail = await response.text();
    console.error("AI gateway error", response.status, detail);
    throw new Error("The AI could not complete this request. Please try again.");
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("The AI returned an empty response. Please try again.");
  return text;
}

const BASE_SYSTEM = [
  "You are Aura, a warm and precise content studio assistant. You write clear, original, publish-ready content with no filler, no meta commentary and no markdown code fences. Never mention that you are an AI model.",
  "",
  "Accuracy rules (always follow):",
  "- Never invent personal experiences, anecdotes or first-person stories (e.g. 'A junior analyst I know...', 'Last week I...') unless the user explicitly provided them.",
  "- Never invent named people, clients, companies, testimonials, quotes, case studies, events, dates, statistics, percentages or research findings. Only use facts, names and numbers the user supplied.",
  "- Prefer general, accurate statements instead, e.g. 'Young professionals can use AI to automate repetitive tasks such as meeting summaries, first-pass research and routine documentation.'",
  "- Treat details in the user's topic as user-provided facts and use them faithfully without embellishing them.",
  "- When an illustration helps, label it naturally as an example or hypothetical (e.g. 'For example, ...', 'Imagine a small bakery that...', 'A hypothetical scenario: ...'). Never present it as a real event or personal experience.",
  "- If first-person content needs a specific detail the user did not give, use a clear placeholder in square brackets such as [your project] or [result] rather than making one up.",
  "- Keep the writing natural, confident and publishable while following these rules.",
].join("\n");

export const generateContent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => generateSchema.parse(data))
  .handler(async ({ data }) => {
    const guide = contentTypeGuides[data.contentType] ?? "Write useful, well-structured content.";
    const lengthGuide = lengthGuides[data.length] ?? lengthGuides["Medium"];

    const user = [
      `Topic or idea: ${data.topic}`,
      `Target audience: ${data.audience}`,
      `Tone: ${data.tone}`,
      guide,
      lengthGuide,
      data.keywords ? `Naturally weave in these keywords: ${data.keywords}.` : "",
      data.callToAction ? `End with this call to action: ${data.callToAction}.` : "",
      "Return only the finished content.",
    ]
      .filter(Boolean)
      .join("\n");

    const text = await callGateway(BASE_SYSTEM, user);
    return { content: text };
  });

export const refineContent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => refineSchema.parse(data))
  .handler(async ({ data }) => {
    const instructions: Record<string, string> = {
      improve:
        "Rewrite the content so it is sharper and more compelling. Strengthen the opening, tighten weak sentences and improve rhythm. Keep roughly the same length and meaning.",
      shorten:
        "Rewrite the content about 40% shorter. Keep every essential idea and the strongest phrasing; cut repetition and filler.",
      expand:
        "Expand the content with genuinely useful detail: a concrete example, supporting reasoning or an extra section. Do not repeat existing sentences.",
    };

    const user = [
      instructions[data.action],
      `Keep the tone ${data.tone} and the audience ${data.audience}.`,
      "Return only the rewritten content.",
      "",
      "Content:",
      data.content,
    ].join("\n");

    const text = await callGateway(BASE_SYSTEM, user);
    return { content: text };
  });

const codeSchema = z.object({
  request: z.string().min(3).max(4000),
  language: z.string().min(1).max(40),
  level: z.string().min(1).max(40),
});

export const generateCode = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => codeSchema.parse(data))
  .handler(async ({ data }) => {
    const system =
      "You are Aura, a patient coding assistant. Write correct, clean, well-commented code. Never invent APIs or libraries that don't exist. Never mention that you are an AI model.";
    const user = [
      `Task: ${data.request}`,
      `Language: ${data.language}`,
      `Explain for a ${data.level} reader.`,
      "Return exactly two parts: first the complete code inside one fenced code block, then a short plain-language explanation under the heading 'How it works' as 3-6 bullet points.",
    ].join("\n");
    const text = await callGateway(system, user);
    const match = text.match(/```[\w+#-]*\n([\s\S]*?)```/);
    const code = match ? match[1].trimEnd() : text;
    const explanation = match ? text.replace(match[0], "").trim() : "";
    return { code, explanation };
  });

# Aura — AI Content Studio

> **Create with intention.** Turn your ideas into polished content with AI.
> *Your ideas. Your voice. Enhanced by AI.*

Aura is an AI-powered content generation studio that turns a simple idea into polished, publish-ready writing. You type a topic, pick a content type, audience, tone and length, and Aura returns structured content you can copy, regenerate, refine or save.

**Live demo:** https://aura-ai-content-studio-171.lovable.app

It is a portfolio project that shows prompt optimisation, content structuring and AI productivity workflows, built with a soft, warm and modern look.

---

## Features

### Welcome page
- Full-screen landing page with the Aura brand, tagline and **Get Started** / **Explore Aura** buttons.

### Dashboard
- Welcome message and a quick **Generate** button
- Recently generated content
- Saved prompts
- Generation statistics
- Favourite content types, shown as visual bars

### Generate
- Inputs: topic or idea, content type, target audience, tone, length, optional keywords and an optional call to action
- **8 content types:** Social Media Caption, LinkedIn Post, Professional Email, Blog Post, Marketing Copy, Study Notes, Content Ideas, Simple Code Explanation
- **8 tones:** Professional, Friendly, Confident, Warm, Educational, Persuasive, Casual, Inspirational
- Output card actions: **Copy, Regenerate, Improve, Shorten, Expand, Save, Clear**, plus a live word count

### Prompt Library
- 16 hand-written prompts in 8 categories: LinkedIn posts, professional emails, social captions, blog introductions, study summaries, marketing, brainstorming and business communication
- Filter by category, **Copy prompt**, or **Use prompt** to prefill the Generate form
- Save your favourite prompts to the Dashboard

### Generate Code
- Describe a task, choose a language and a level (Beginner, Intermediate or Advanced)
- Returns clean, commented code plus a plain-language "How it works" explanation

### Saved Content
- Keep the pieces you like, stored locally in your browser

### About
- What Aura is for and who it helps

---

## Responsible AI: accuracy rules

Every request (including Improve, Shorten, Expand and Regenerate) uses a shared system prompt that tells the model **never to invent**:
- personal experiences or first-person anecdotes
- named people, clients, companies, testimonials or quotes
- statistics, research findings, case studies, events or dates

Instead, Aura uses accurate general statements, clearly labelled examples or hypotheticals ("For example…", "Imagine…"), and `[placeholders]` for details only the user can supply.

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | [TanStack Start](https://tanstack.com/start) (React 19, SSR, server functions) |
| Build | Vite 7 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 with design tokens, shadcn/ui components |
| AI | Lovable AI Gateway (Google Gemini), called from server functions |
| Validation | Zod |
| Notifications | Sonner |
| Persistence | Browser localStorage (history, saved content, saved prompts) |
| Hosting | Lovable (edge runtime) |

---

## Design system

A soft, sophisticated and warm look. Not overly pink or decorative.

| Token | Colour | Use |
| --- | --- | --- |
| Cream | `#F8F3EC` | Background |
| Deep chocolate | `#3A2924` | Text |
| Caramel | `#B9825B` | Primary actions |
| Soft beige | `#E9DED2` | Surfaces |
| Muted rose | `#C89B9B` | Accent |
| Soft gold | `#C7A46A` | Accent |

Typography: **Fraunces** (display) and **Karla** (body). Rounded cards, subtle shadows and generous spacing throughout. The layout works on desktop (sidebar), tablet and mobile (slide-out menu).

---

## Project structure

```text
src/
├── assets/                 # Hero and welcome imagery
├── components/
│   ├── AppShell.tsx        # Sidebar, mobile menu, brand
│   ├── ContentCard.tsx     # Output card with actions + word count
│   ├── PageHeader.tsx
│   └── ui/                 # shadcn/ui primitives
├── lib/
│   ├── content.ts          # Content types, tones, lengths, audiences
│   ├── prompts.ts          # Prompt Library data
│   ├── generate.functions.ts # Server functions: generate, refine, code
│   └── store.ts            # localStorage hooks
├── routes/
│   ├── __root.tsx          # App shell, fonts, meta
│   ├── index.tsx           # Welcome page
│   ├── dashboard.tsx
│   ├── generate.tsx
│   ├── prompts.tsx
│   ├── code.tsx
│   ├── saved.tsx
│   └── about.tsx
└── styles.css              # Tailwind v4 theme + design tokens
```

---

## How generation works

1. The form data is checked on the server with Zod.
2. A server function builds a prompt from the content-type guide (for example, a LinkedIn post gets a hook, short paragraphs and a closing question), the length guide, tone, audience, keywords and call to action.
3. The request goes to the AI Gateway along with Aura's system prompt and accuracy rules.
4. Rate-limit (429) and credit (402) errors come back as friendly messages.
5. The result shows up in the output card, where you can refine it with Improve, Shorten or Expand.

---

## Getting started locally

Requirements: Node.js 20+ (or Bun).

```sh
git clone <this-repository-url>
cd <repository-name>
npm install
npm run dev
```

The app runs at `http://localhost:8080`.

### Environment variables

AI generation needs an API key for the AI Gateway on the server:

```env
LOVABLE_API_KEY=your_key_here
```

When the project runs inside Lovable, this key is provided automatically.

---

## Roadmap ideas

- Chat mode for brainstorming and reworking drafts
- User accounts with cloud-synced saved content
- Export to PDF / Markdown
- Custom brand voice profiles

---

## Author

Built by **Andile Khoza** with [Lovable](https://lovable.dev).

import type { Note } from "@/types/entities";

const base = {
  isArchived: false,
  projectId: null,
  createdAt: "2026-07-10T09:00:00Z",
  updatedAt: "2026-07-16T09:00:00Z",
};

/** One fixture per each of the 10 note types. */
export const noteFixtures: Note[] = [
  { ...base, id: "note-text", type: "text", title: "Kickoff thoughts", body: "The client wants a calm, editorial feel. Avoid dashboard clutter; lead with imagery." },
  {
    ...base,
    id: "note-checklist",
    type: "checklist",
    title: "Launch checklist",
    items: [
      { text: "Export final assets", done: true },
      { text: "Write handoff notes", done: false },
      { text: "Record walkthrough", done: false },
    ],
  },
  {
    ...base,
    id: "note-bookmark",
    type: "bookmark",
    title: "Refactoring UI",
    url: "https://www.refactoringui.com",
    faviconUrl: "https://www.refactoringui.com/favicon.ico",
    domain: "refactoringui.com",
    snippet: "Learn how to design beautiful user interfaces by yourself.",
  },
  {
    ...base,
    id: "note-image",
    type: "image",
    title: "Palette reference",
    coverImageUrl: "https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=800&q=80",
  },
  {
    ...base,
    id: "note-moodboard",
    type: "moodboard",
    title: "Spring moodboard",
    images: [
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80",
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80",
      "https://images.unsplash.com/photo-1462536943532-57a629f6cc60?w=400&q=80",
    ],
  },
  {
    ...base,
    id: "note-code",
    type: "code",
    title: "Debounce helper",
    language: "typescript",
    code: "export function debounce<T extends (...a: any[]) => void>(fn: T, ms: number) {\n  let t: number;\n  return (...args: Parameters<T>) => {\n    clearTimeout(t);\n    t = setTimeout(() => fn(...args), ms);\n  };\n}",
  },
  {
    ...base,
    id: "note-quote",
    type: "quote",
    title: "On simplicity",
    quote: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
  },
  {
    ...base,
    id: "note-recipe",
    type: "recipe",
    title: "Studio matcha latte",
    ingredients: ["2g ceremonial matcha", "60ml hot water (80°C)", "180ml oat milk", "1 tsp honey"],
  },
  {
    ...base,
    id: "note-pdf",
    type: "pdf",
    title: "Brand guidelines",
    filename: "aurora-brand-guidelines.pdf",
    pageCount: 42,
  },
  {
    ...base,
    id: "note-meeting",
    type: "meeting",
    title: "Weekly sync — Aurora",
    attendees: [
      { name: "Mara", avatarUrl: null },
      { name: "Devon", avatarUrl: null },
      { name: "You", avatarUrl: null },
    ],
    agenda: ["Review new onboarding flow", "Decide on final palette", "Plan handoff timeline"],
  },
];

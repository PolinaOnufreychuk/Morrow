import type { Note } from "@/types/entities";
import wayfindingCover from "@/assets/lotus-petals-1.png";

const now = Date.now();
const daysAgo = (days: number) => new Date(now - days * 24 * 60 * 60 * 1000).toISOString();

const base = {
  isArchived: false,
  archivedAt: null,
  projectIds: [],
};

export const noteFixtures: Note[] = [
  {
    ...base,
    id: "note-clarity-quote",
    type: "quote",
    title: "On clarity",
    quote: "Design is not just what it looks like and feels like. Design is how it works.",
    author: "Steve Jobs",
    createdAt: daysAgo(11),
    updatedAt: daysAgo(1),
  },
  {
    ...base,
    id: "note-design-system-naming",
    type: "text",
    title: "Design system naming ideas",
    body: 'Considered "Petal", "Morrow", "Haze". Morrow feels the most fitting — calm, editorial, a little poetic without being precious.',
    createdAt: daysAgo(20),
    updatedAt: daysAgo(3),
  },
  {
    ...base,
    id: "note-weekly-retro-27",
    type: "text",
    title: "Weekly retro — week 27",
    body: "Shipped the checkout redesign. Drop-off dropped 8% in the first cohort. Next: instrument the confirmation step and start on the empty-state pass.",
    createdAt: daysAgo(15),
    updatedAt: daysAgo(4),
  },
  {
    ...base,
    projectIds: ["prj-fintech-onboarding"],
    id: "note-before-next-review",
    type: "checklist",
    title: "Before next review",
    items: [
      { text: "Finalize consent screen copy", done: true },
      { text: "Legal sign-off on document upload", done: false },
      { text: "Add progress indicator to all 5 steps", done: false },
      { text: "Share prototype with Priya", done: true },
    ],
    createdAt: daysAgo(8),
    updatedAt: daysAgo(1),
  },
  {
    ...base,
    id: "note-client-brief-v3",
    type: "pdf",
    title: "Client brief — v3",
    description: "Scope, KYC requirements and the 6-week timeline.",
    fileUrl: "https://example.com/fintech-brief-v3.pdf",
    filename: "fintech-brief-v3.pdf",
    createdAt: daysAgo(18),
    updatedAt: daysAgo(5),
  },
  {
    ...base,
    id: "note-wayfinding-kiosk-site-visit",
    type: "image",
    title: "Wayfinding kiosk — site visit",
    coverImageUrl: wayfindingCover,
    createdAt: daysAgo(14),
    updatedAt: daysAgo(2),
  },
  {
    ...base,
    id: "note-reading-list-service-design",
    type: "checklist",
    title: "Reading list — service design",
    items: [
      { text: "Service Design Doing — ch.4", done: true },
      { text: "Ch.5 — prototyping services", done: false },
    ],
    createdAt: daysAgo(30),
    updatedAt: daysAgo(9),
  },
];

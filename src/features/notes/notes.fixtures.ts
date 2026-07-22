import type { Note } from "@/types/entities";
import wayfindingCover from "@/assets/lotus-petals-1.png";

const now = Date.now();
const daysAgo = (days: number) => new Date(now - days * 24 * 60 * 60 * 1000).toISOString();

const base = {
  isArchived: false,
  projectId: null,
};

export const noteFixtures: Note[] = [
  {
    ...base,
    projectId: "prj-fintech-onboarding",
    id: "note-client-kickoff",
    type: "meeting",
    title: "Client kickoff — Fintech app",
    attendees: [
      { name: "Priya", avatarUrl: null },
      { name: "Sam", avatarUrl: null },
      { name: "Alex", avatarUrl: null },
    ],
    agenda: [
      "Confirm KYC scope for phase 1",
      "Review compliance constraints",
      "Align on 6-week timeline",
    ],
    createdAt: daysAgo(10),
    updatedAt: daysAgo(1),
  },
  {
    ...base,
    id: "note-debounced-search-hook",
    type: "code",
    title: "Debounced search hook",
    language: "typescript",
    code: "function useDebounce(value, delay) {\n  const [d, setD] = useState(value);\n  useEffect(() => {\n    const t = setTimeout(() => setD(value), delay);\n    return () => clearTimeout(t);\n  }, [value, delay]);\n  return d;\n}",
    createdAt: daysAgo(12),
    updatedAt: daysAgo(2),
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
    projectId: "prj-fintech-onboarding",
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
    id: "note-weeknight-miso-soup",
    type: "recipe",
    title: "Weeknight miso soup",
    ingredients: ["Miso paste", "Silken tofu", "Scallions", "Dashi stock"],
    createdAt: daysAgo(25),
    updatedAt: daysAgo(6),
  },
  {
    ...base,
    id: "note-client-brief-v3",
    type: "pdf",
    title: "Client brief — v3",
    filename: "fintech-brief-v3.pdf",
    pageCount: 12,
    createdAt: daysAgo(18),
    updatedAt: daysAgo(5),
  },
  {
    ...base,
    id: "note-designing-with-clarity",
    type: "bookmark",
    title: "Designing with Clarity",
    url: "https://www.nytimes.com/designing-with-clarity",
    faviconUrl: null,
    domain: "nytimes.com",
    snippet: "Editorial piece on reducing friction through intentional visual choices.",
    createdAt: daysAgo(22),
    updatedAt: daysAgo(7),
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

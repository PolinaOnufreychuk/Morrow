// One-off script to fill Supabase with realistic demo content for UI polishing.
// Run once against an empty database: node --env-file=.env scripts/seed-demo-data.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in the environment.");
  process.exit(1);
}
const supabase = createClient(url, key);

const now = Date.now();
const daysAgo = (days) => new Date(now - days * 24 * 60 * 60 * 1000).toISOString();
const img = (name) => `/demo/${name}`;

async function assertEmpty() {
  const { count, error } = await supabase.from("projects").select("*", { count: "exact", head: true });
  if (error) throw error;
  if (count && count > 0) {
    console.error(
      `projects table already has ${count} row(s) — refusing to run to avoid duplicates. This script is meant to run once against an empty database.`,
    );
    process.exit(1);
  }
}

async function insertProjects() {
  const rows = [
    {
      title: "Fintech onboarding redesign",
      cover_image_url: img("petal-macro-1.png"),
      description: "Simplifying KYC and account setup for a challenger bank.",
      status: "in-progress",
      deadline: "2026-08-14",
      category: "Mobile",
      tags: ["Mobile", "fintech", "ios"],
      external_links: [
        { label: "Figma — Component library", url: "https://figma.com/file/fintech-onboarding" },
        { label: "Staging build", url: "https://staging.example.com/fintech-onboarding" },
      ],
      notes:
        "Stakeholders want a progress indicator across all steps. Legal needs to review copy on the consent screen before the next review.",
      is_archived: false,
      created_at: daysAgo(45),
      updated_at: daysAgo(2),
    },
    {
      title: "Meditation app onboarding flow",
      cover_image_url: img("lotus-petals-1.png"),
      description: "Five-screen flow introducing breathing exercises.",
      status: "in-progress",
      deadline: "2026-08-01",
      category: "Mobile",
      tags: ["Mobile", "wellness"],
      external_links: [{ label: "Figma", url: "https://figma.com/file/meditation-onboarding" }],
      notes: null,
      is_archived: false,
      created_at: daysAgo(30),
      updated_at: daysAgo(3),
    },
    {
      title: "Wellness app design system",
      cover_image_url: img("grain-gradient-sage-blush.png"),
      description: "Component library and tokens for a meditation app.",
      status: "review",
      deadline: "2026-07-30",
      category: "Design system",
      tags: ["Design system", "components"],
      external_links: [{ label: "Storybook", url: "https://storybook.example.com/wellness" }],
      notes: null,
      is_archived: false,
      created_at: daysAgo(60),
      updated_at: daysAgo(5),
    },
    {
      title: "Grocery delivery checkout",
      cover_image_url: img("petal-macro-2.png"),
      description: "Reducing drop-off during payment and address entry.",
      status: "review",
      deadline: "2026-08-05",
      category: "Mobile",
      tags: ["Mobile", "checkout"],
      external_links: [],
      notes: null,
      is_archived: false,
      created_at: daysAgo(20),
      updated_at: daysAgo(6),
    },
    {
      title: "Farmers market wayfinding",
      cover_image_url: img("glass-leaf-sage.png"),
      description: "Signage and kiosk concepts for a city market.",
      status: "done",
      deadline: "2026-06-20",
      category: "Physical",
      tags: ["Physical", "signage"],
      external_links: [],
      notes: null,
      is_archived: false,
      created_at: daysAgo(90),
      updated_at: daysAgo(12),
    },
    {
      title: "Studio portfolio site v2",
      cover_image_url: img("grain-gradient-green.png"),
      description: "Personal site rebuild with new case studies.",
      status: "done",
      deadline: "2026-05-15",
      category: "Web",
      tags: ["Web", "portfolio"],
      external_links: [{ label: "Live site", url: "https://example.com" }],
      notes: null,
      is_archived: false,
      created_at: daysAgo(120),
      updated_at: daysAgo(18),
    },
    {
      title: "Coffee subscription landing page",
      cover_image_url: img("hero-meadow.png"),
      description: "Marketing site for a monthly coffee subscription box.",
      status: "done",
      deadline: "2026-04-10",
      category: "Web",
      tags: ["Web", "marketing"],
      external_links: [],
      notes: null,
      is_archived: true,
      created_at: daysAgo(150),
      updated_at: daysAgo(60),
    },
    {
      title: "Museum audio guide app",
      cover_image_url: img("glass-flower-pink.png"),
      description: "Concept exploration for a self-guided museum tour app.",
      status: "in-progress",
      deadline: "2026-03-01",
      category: "Mobile",
      tags: ["Mobile", "culture"],
      external_links: [],
      notes: null,
      is_archived: true,
      created_at: daysAgo(200),
      updated_at: daysAgo(80),
    },
  ];
  const { data, error } = await supabase.from("projects").insert(rows).select("id, title");
  if (error) throw error;
  return Object.fromEntries(data.map((row) => [row.title, row.id]));
}

async function insertBoards(projectIds) {
  const rows = [
    {
      title: "Morning color studies",
      cover_image_url: img("lotus-petals-1.png"),
      tags: ["Color"],
      notes: "Warm, dusted palettes pulled from early-morning light.",
      project_id: null,
      is_archived: false,
      created_at: daysAgo(70),
      updated_at: daysAgo(1),
    },
    {
      title: "Soft shadow card patterns",
      cover_image_url: img("grain-gradient-sage-blush.png"),
      tags: ["UI patterns"],
      notes: null,
      project_id: projectIds["Wellness app design system"] ?? null,
      is_archived: false,
      created_at: daysAgo(50),
      updated_at: daysAgo(2),
    },
    {
      title: "Editorial serif pairings",
      cover_image_url: img("grain-gradient-green.png"),
      tags: ["Typography"],
      notes: null,
      project_id: null,
      is_archived: false,
      created_at: daysAgo(40),
      updated_at: daysAgo(4),
    },
    {
      title: "Glass botanical objects",
      cover_image_url: img("glass-flower-pink.png"),
      tags: ["Illustration"],
      notes: "Reference set for the glass-morphism 3D illustration style.",
      project_id: null,
      is_archived: false,
      created_at: daysAgo(90),
      updated_at: daysAgo(3),
    },
    {
      title: "Muted morning palettes",
      cover_image_url: img("petal-macro-1.png"),
      tags: ["Color"],
      notes: null,
      project_id: null,
      is_archived: false,
      created_at: daysAgo(35),
      updated_at: daysAgo(6),
    },
    {
      title: "Quiet onboarding flows",
      cover_image_url: img("petal-macro-2.png"),
      tags: ["UX patterns"],
      notes: null,
      project_id: projectIds["Fintech onboarding redesign"] ?? null,
      is_archived: false,
      created_at: daysAgo(25),
      updated_at: daysAgo(5),
    },
    {
      title: "Retired branding moodboard",
      cover_image_url: img("hero-meadow.png"),
      tags: ["Branding"],
      notes: null,
      project_id: null,
      is_archived: true,
      created_at: daysAgo(180),
      updated_at: daysAgo(70),
    },
  ];
  const { data, error } = await supabase.from("inspiration_boards").insert(rows).select("id, title");
  if (error) throw error;
  return Object.fromEntries(data.map((row) => [row.title, row.id]));
}

async function insertReferences(boardIds) {
  const REFERENCE_IMAGES = [
    "lotus-petals-1.png",
    "lotus-petals-2.png",
    "petal-macro-1.png",
    "petal-macro-2.png",
    "glass-flower-pink.png",
    "glass-leaf-sage.png",
    "grain-gradient-green.png",
    "grain-gradient-sage-blush.png",
    "hero-meadow.png",
  ];
  const makeRefs = (boardTitle, count) => {
    const boardId = boardIds[boardTitle];
    if (!boardId) return [];
    return Array.from({ length: count }, (_, index) => ({
      board_id: boardId,
      image_url: img(REFERENCE_IMAGES[index % REFERENCE_IMAGES.length]),
      source_url: null,
      position: index,
      created_at: daysAgo(60 - index),
    }));
  };
  const rows = [
    ...makeRefs("Morning color studies", 24),
    ...makeRefs("Soft shadow card patterns", 12),
    ...makeRefs("Editorial serif pairings", 9),
    ...makeRefs("Glass botanical objects", 31),
    ...makeRefs("Muted morning palettes", 18),
    ...makeRefs("Quiet onboarding flows", 15),
    ...makeRefs("Retired branding moodboard", 6),
  ];
  const { error } = await supabase.from("inspiration_references").insert(rows);
  if (error) throw error;
}

async function insertNotes(projectIds) {
  const rows = [
    {
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
      project_id: projectIds["Fintech onboarding redesign"] ?? null,
      is_archived: false,
      created_at: daysAgo(10),
      updated_at: daysAgo(1),
    },
    {
      type: "code",
      title: "Debounced search hook",
      language: "typescript",
      code: "function useDebounce(value, delay) {\n  const [d, setD] = useState(value);\n  useEffect(() => {\n    const t = setTimeout(() => setD(value), delay);\n    return () => clearTimeout(t);\n  }, [value, delay]);\n  return d;\n}",
      is_archived: false,
      created_at: daysAgo(12),
      updated_at: daysAgo(2),
    },
    {
      type: "text",
      title: "Design system naming ideas",
      body: 'Considered "Petal", "Morrow", "Haze". Morrow feels the most fitting — calm, editorial, a little poetic without being precious.',
      is_archived: false,
      created_at: daysAgo(20),
      updated_at: daysAgo(3),
    },
    {
      type: "text",
      title: "Weekly retro — week 27",
      body: "Shipped the checkout redesign. Drop-off dropped 8% in the first cohort. Next: instrument the confirmation step and start on the empty-state pass.",
      is_archived: false,
      created_at: daysAgo(15),
      updated_at: daysAgo(4),
    },
    {
      type: "checklist",
      title: "Before next review",
      items: [
        { text: "Finalize consent screen copy", done: true },
        { text: "Legal sign-off on document upload", done: false },
        { text: "Add progress indicator to all 5 steps", done: false },
        { text: "Share prototype with Priya", done: true },
      ],
      project_id: projectIds["Fintech onboarding redesign"] ?? null,
      is_archived: false,
      created_at: daysAgo(8),
      updated_at: daysAgo(1),
    },
    {
      type: "recipe",
      title: "Weeknight miso soup",
      ingredients: ["Miso paste", "Silken tofu", "Scallions", "Dashi stock"],
      is_archived: false,
      created_at: daysAgo(25),
      updated_at: daysAgo(6),
    },
    {
      type: "pdf",
      title: "Client brief — v3",
      filename: "fintech-brief-v3.pdf",
      page_count: 12,
      is_archived: false,
      created_at: daysAgo(18),
      updated_at: daysAgo(5),
    },
    {
      type: "bookmark",
      title: "Designing with Clarity",
      url: "https://www.nytimes.com/designing-with-clarity",
      favicon_url: null,
      domain: "nytimes.com",
      snippet: "Editorial piece on reducing friction through intentional visual choices.",
      is_archived: false,
      created_at: daysAgo(22),
      updated_at: daysAgo(7),
    },
    {
      type: "image",
      title: "Wayfinding kiosk — site visit",
      cover_image_url: img("lotus-petals-1.png"),
      is_archived: false,
      created_at: daysAgo(14),
      updated_at: daysAgo(2),
    },
    {
      type: "checklist",
      title: "Reading list — service design",
      items: [
        { text: "Service Design Doing — ch.4", done: true },
        { text: "Ch.5 — prototyping services", done: false },
      ],
      is_archived: false,
      created_at: daysAgo(30),
      updated_at: daysAgo(9),
    },
    {
      type: "quote",
      title: "Simplicity",
      quote: "Simplicity is not the absence of clutter — that is a consequence of simplicity.",
      author: "Jony Ive",
      is_archived: false,
      created_at: daysAgo(28),
      updated_at: daysAgo(8),
    },
    {
      type: "moodboard",
      title: "Morning color studies",
      images: [
        img("lotus-petals-1.png"),
        img("glass-flower-pink.png"),
        img("grain-gradient-green.png"),
        img("petal-macro-2.png"),
      ],
      is_archived: false,
      created_at: daysAgo(17),
      updated_at: daysAgo(1),
    },
    {
      type: "text",
      title: "Old brand voice notes",
      body: "Draft notes from the earlier branding pass — superseded by the current design system doc.",
      is_archived: true,
      created_at: daysAgo(160),
      updated_at: daysAgo(90),
    },
    {
      type: "checklist",
      title: "Launch checklist — portfolio v1",
      items: [
        { text: "Write case studies", done: true },
        { text: "Set up analytics", done: true },
      ],
      is_archived: true,
      created_at: daysAgo(140),
      updated_at: daysAgo(85),
    },
  ];
  const { error } = await supabase.from("notes").insert(rows);
  if (error) throw error;
}

async function insertResources(projectIds) {
  const rows = [
    {
      kind: "link",
      title: "Nielsen Norman — Onboarding UX",
      url: "https://www.nngroup.com/articles/onboarding-ux",
      description: "Research-backed patterns for reducing drop-off in multi-step onboarding.",
      tags: ["UX Research"],
      reading_minutes: 8,
      is_figma: false,
      project_id: projectIds["Fintech onboarding redesign"] ?? null,
      is_archived: false,
      created_at: daysAgo(20),
      updated_at: daysAgo(2),
    },
    {
      kind: "pdf",
      title: "Service Design Doing — ch.4 excerpt",
      url: "https://example.com/service-design-ch4.pdf",
      description: null,
      tags: ["UX Research"],
      filename: "service-design-ch4.pdf",
      is_archived: false,
      created_at: daysAgo(15),
      updated_at: daysAgo(3),
    },
    {
      kind: "link",
      title: "Client brief — Fintech app",
      url: "https://notion.so/client-brief-fintech",
      description: "Full project brief, stakeholder list and success metrics.",
      tags: ["Fintech"],
      reading_minutes: null,
      project_id: projectIds["Fintech onboarding redesign"] ?? null,
      is_archived: false,
      created_at: daysAgo(25),
      updated_at: daysAgo(4),
    },
    {
      kind: "repo",
      title: "copilot-for-xcode",
      url: "https://github.com/github/CopilotForXcode",
      description: "AI coding assistant for Xcode — reference for inline suggestion UI.",
      tags: ["AI"],
      owner: "github",
      repo_name: "copilot-for-xcode",
      language: "Swift",
      stars: 5500,
      is_archived: false,
      created_at: daysAgo(40),
      updated_at: daysAgo(3),
    },
    {
      kind: "link",
      title: "W3C — Accessible motion guidelines",
      url: "https://www.w3.org/WAI/accessible-motion",
      description: "Guidance on reduced motion and vestibular-safe animation.",
      tags: ["Accessibility"],
      reading_minutes: 5,
      is_archived: false,
      created_at: daysAgo(30),
      updated_at: daysAgo(5),
    },
    {
      kind: "preview",
      title: "Framer — Shopify Editions Winter '26",
      url: "https://framer.com/shopify-editions-winter-26",
      description: null,
      tags: ["Development"],
      preview_image_url: img("grain-gradient-green.png"),
      is_figma: false,
      is_archived: false,
      created_at: daysAgo(10),
      updated_at: daysAgo(6),
    },
    {
      kind: "preview",
      title: "Fintech onboarding — component library",
      url: "https://figma.com/fintech-component-library",
      description: null,
      tags: ["Fintech"],
      preview_image_url: null,
      is_figma: true,
      project_id: projectIds["Fintech onboarding redesign"] ?? null,
      is_archived: false,
      created_at: daysAgo(35),
      updated_at: daysAgo(2),
    },
    {
      kind: "link",
      title: "Editorial type pairings",
      url: "https://example.com/editorial-type-pairings",
      description: "Curated serif/sans pairings for editorial products.",
      tags: ["Typography"],
      reading_minutes: 4,
      is_archived: false,
      created_at: daysAgo(28),
      updated_at: daysAgo(7),
    },
    {
      kind: "video",
      title: "Calm motion studies — walkthrough",
      url: "https://youtube.com/watch?v=calm-motion-studies",
      description: "Screen recording walking through reduced-motion transition timing.",
      tags: ["Motion"],
      thumbnail_url: img("hero-meadow.png"),
      duration: "6:42",
      is_archived: false,
      created_at: daysAgo(9),
      updated_at: daysAgo(1),
    },
    {
      kind: "image",
      title: "Muted morning palette reference",
      url: "https://example.com/muted-morning-palette",
      description: "Reference swatch board for the muted morning palette.",
      tags: ["Branding"],
      cover_image_url: img("petal-macro-1.png"),
      is_archived: false,
      created_at: daysAgo(13),
      updated_at: daysAgo(2),
    },
    {
      kind: "link",
      title: "Old competitor teardown — banking apps",
      url: "https://example.com/banking-teardown-2025",
      description: "Superseded by the newer fintech onboarding research.",
      tags: ["UX Research"],
      reading_minutes: 11,
      is_archived: true,
      created_at: daysAgo(170),
      updated_at: daysAgo(95),
    },
  ];
  const rowsWithDefaults = rows.map((row) => ({ is_figma: false, ...row }));
  const { error } = await supabase.from("resources").insert(rowsWithDefaults);
  if (error) throw error;
}

async function main() {
  await assertEmpty();
  console.log("Seeding projects…");
  const projectIds = await insertProjects();
  console.log("Seeding inspiration boards…");
  const boardIds = await insertBoards(projectIds);
  console.log("Seeding inspiration references…");
  await insertReferences(boardIds);
  console.log("Seeding notes…");
  await insertNotes(projectIds);
  console.log("Seeding resources…");
  await insertResources(projectIds);
  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

import type { Project } from "@/types/entities";

/** Static mock data so pages render without a backend. */
export const projectFixtures: Project[] = [
  {
    id: "prj-001",
    title: "Aurora — Mobile Banking App",
    coverImageUrl:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    description:
      "End-to-end redesign of the Aurora mobile banking experience, focused on calm, trustworthy interactions.",
    status: "in-progress",
    deadline: "2026-08-14",
    tags: ["fintech", "mobile", "ios"],
    externalLinks: [
      { label: "Figma", url: "https://figma.com/file/aurora" },
      { label: "Demo", url: "https://aurora.example.com" },
    ],
    notes: "Waiting on final brand palette from the client before high-fidelity screens.",
    isArchived: false,
    createdAt: "2026-06-01T09:00:00Z",
    updatedAt: "2026-07-18T14:30:00Z",
  },
  {
    id: "prj-002",
    title: "Verdant — Sustainability Dashboard",
    coverImageUrl:
      "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&q=80",
    description: "A data-rich dashboard helping teams track their carbon footprint.",
    status: "review",
    deadline: "2026-07-30",
    tags: ["dashboard", "data-viz", "web"],
    externalLinks: [{ label: "GitHub", url: "https://github.com/example/verdant" }],
    notes: null,
    isArchived: false,
    createdAt: "2026-05-12T09:00:00Z",
    updatedAt: "2026-07-16T11:00:00Z",
  },
];

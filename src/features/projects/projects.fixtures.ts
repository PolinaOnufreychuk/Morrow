import type { Project } from "@/types/entities";
import petalMacro1 from "@/assets/petal-macro-1.png";
import lotusPetals1 from "@/assets/lotus-petals-1.png";
import grainSageBlush from "@/assets/grain-gradient-sage-blush.png";
import petalMacro2 from "@/assets/petal-macro-2.png";
import glassLeafSage from "@/assets/glass-leaf-sage.png";
import grainGreen from "@/assets/grain-gradient-green.png";

const now = Date.now();
const daysAgo = (days: number) => new Date(now - days * 24 * 60 * 60 * 1000).toISOString();

/** Static mock data so pages render without a backend. */
export const projectFixtures: Project[] = [
  {
    id: "prj-fintech-onboarding",
    title: "Fintech onboarding redesign",
    coverImageUrl: petalMacro1,
    description: "Simplifying KYC and account setup for a challenger bank.",
    status: "in-progress",
    deadline: "2026-08-14",
    category: "Mobile",
    tags: ["Mobile", "fintech", "ios"],
    externalLinks: [
      { label: "Figma — Component library", url: "https://figma.com/file/fintech-onboarding" },
      { label: "Staging build", url: "https://staging.example.com/fintech-onboarding" },
    ],
    notes:
      "Stakeholders want a progress indicator across all steps. Legal needs to review copy on the consent screen before the next review.",
    isArchived: false,
    createdAt: daysAgo(45),
    updatedAt: daysAgo(2),
  },
  {
    id: "prj-meditation-onboarding",
    title: "Meditation app onboarding flow",
    coverImageUrl: lotusPetals1,
    description: "Five-screen flow introducing breathing exercises.",
    status: "in-progress",
    deadline: "2026-08-01",
    category: "Mobile",
    tags: ["Mobile", "wellness"],
    externalLinks: [{ label: "Figma", url: "https://figma.com/file/meditation-onboarding" }],
    notes: null,
    isArchived: false,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(3),
  },
  {
    id: "prj-wellness-design-system",
    title: "Wellness app design system",
    coverImageUrl: grainSageBlush,
    description: "Component library and tokens for a meditation app.",
    status: "review",
    deadline: "2026-07-30",
    category: "Design system",
    tags: ["Design system", "components"],
    externalLinks: [{ label: "Storybook", url: "https://storybook.example.com/wellness" }],
    notes: null,
    isArchived: false,
    createdAt: daysAgo(60),
    updatedAt: daysAgo(5),
  },
  {
    id: "prj-grocery-checkout",
    title: "Grocery delivery checkout",
    coverImageUrl: petalMacro2,
    description: "Reducing drop-off during payment and address entry.",
    status: "review",
    deadline: "2026-08-05",
    category: "Mobile",
    tags: ["Mobile", "checkout"],
    externalLinks: [],
    notes: null,
    isArchived: false,
    createdAt: daysAgo(20),
    updatedAt: daysAgo(6),
  },
  {
    id: "prj-farmers-market-wayfinding",
    title: "Farmers market wayfinding",
    coverImageUrl: glassLeafSage,
    description: "Signage and kiosk concepts for a city market.",
    status: "done",
    deadline: "2026-06-20",
    category: "Physical",
    tags: ["Physical", "signage"],
    externalLinks: [],
    notes: null,
    isArchived: false,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(12),
  },
  {
    id: "prj-studio-portfolio-v2",
    title: "Studio portfolio site v2",
    coverImageUrl: grainGreen,
    description: "Personal site rebuild with new case studies.",
    status: "done",
    deadline: "2026-05-15",
    category: "Web",
    tags: ["Web", "portfolio"],
    externalLinks: [{ label: "Live site", url: "https://example.com" }],
    notes: null,
    isArchived: false,
    createdAt: daysAgo(120),
    updatedAt: daysAgo(18),
  },
];

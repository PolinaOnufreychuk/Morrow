import type { InspirationBoard, InspirationReference } from "@/types/entities";
import lotusPetals1 from "@/assets/lotus-petals-1.png";
import lotusPetals2 from "@/assets/lotus-petals-2.png";
import petalMacro1 from "@/assets/petal-macro-1.png";
import petalMacro2 from "@/assets/petal-macro-2.png";
import glassFlowerPink from "@/assets/glass-flower-pink.png";
import glassLeafSage from "@/assets/glass-leaf-sage.png";
import grainGreen from "@/assets/grain-gradient-green.png";
import grainSageBlush from "@/assets/grain-gradient-sage-blush.png";
import heroMeadow from "@/assets/hero-meadow.png";

const REFERENCE_IMAGES = [
  lotusPetals1,
  lotusPetals2,
  petalMacro1,
  petalMacro2,
  glassFlowerPink,
  glassLeafSage,
  grainGreen,
  grainSageBlush,
  heroMeadow,
];

const now = Date.now();
const daysAgo = (days: number) => new Date(now - days * 24 * 60 * 60 * 1000).toISOString();

/** Builds `count` reference rows for a board, cycling the shared demo image pool. */
function makeReferences(boardId: string, count: number): InspirationReference[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${boardId}-ref-${index}`,
    boardId,
    imageUrl: REFERENCE_IMAGES[index % REFERENCE_IMAGES.length],
    sourceUrl: null,
    position: index,
    createdAt: daysAgo(60 - index),
  }));
}

export const boardFixtures: InspirationBoard[] = [
  {
    id: "brd-morning-color-studies",
    title: "Morning color studies",
    coverImageUrl: lotusPetals1,
    tags: ["Color"],
    notes: "Warm, dusted palettes pulled from early-morning light.",
    projectIds: [],
    isArchived: false,
    archivedAt: null,
    createdAt: daysAgo(70),
    updatedAt: daysAgo(1),
  },
  {
    id: "brd-soft-shadow-card-patterns",
    title: "Soft shadow card patterns",
    coverImageUrl: grainSageBlush,
    tags: ["UI patterns"],
    notes: null,
    projectIds: ["prj-wellness-design-system"],
    isArchived: false,
    archivedAt: null,
    createdAt: daysAgo(50),
    updatedAt: daysAgo(2),
  },
  {
    id: "brd-editorial-serif-pairings",
    title: "Editorial serif pairings",
    coverImageUrl: grainGreen,
    tags: ["Typography"],
    notes: null,
    projectIds: [],
    isArchived: false,
    archivedAt: null,
    createdAt: daysAgo(40),
    updatedAt: daysAgo(4),
  },
  {
    id: "brd-glass-botanical-objects",
    title: "Glass botanical objects",
    coverImageUrl: glassFlowerPink,
    tags: ["Illustration"],
    notes: "Reference set for the glass-morphism 3D illustration style.",
    projectIds: [],
    isArchived: false,
    archivedAt: null,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(3),
  },
  {
    id: "brd-muted-morning-palettes",
    title: "Muted morning palettes",
    coverImageUrl: petalMacro1,
    tags: ["Color"],
    notes: null,
    projectIds: [],
    isArchived: false,
    archivedAt: null,
    createdAt: daysAgo(35),
    updatedAt: daysAgo(6),
  },
  {
    id: "brd-quiet-onboarding-flows",
    title: "Quiet onboarding flows",
    coverImageUrl: petalMacro2,
    tags: ["UX patterns"],
    notes: null,
    projectIds: ["prj-fintech-onboarding"],
    isArchived: false,
    archivedAt: null,
    createdAt: daysAgo(25),
    updatedAt: daysAgo(5),
  },
];

export const referenceFixtures: InspirationReference[] = [
  ...makeReferences("brd-morning-color-studies", 24),
  ...makeReferences("brd-soft-shadow-card-patterns", 12),
  ...makeReferences("brd-editorial-serif-pairings", 9),
  ...makeReferences("brd-glass-botanical-objects", 31),
  ...makeReferences("brd-muted-morning-palettes", 18),
  ...makeReferences("brd-quiet-onboarding-flows", 15),
];

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class lists, resolving conflicting utility classes. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Newest-first by `updatedAt` — shared by every "latest"/"recently updated" list. */
export function sortByRecency<T extends { updatedAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

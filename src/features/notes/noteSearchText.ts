import type { Note } from "@/types/entities";

/** Extracts the type-specific "content" text used for search matching, on top of the shared `title`. */
export function getNoteSearchText(note: Note): string {
  switch (note.type) {
    case "text":
      return note.body;
    case "checklist":
      return note.items.map((item) => item.text).join(" ");
    case "quote":
      return [note.quote, note.author].filter(Boolean).join(" ");
    case "pdf":
      return note.filename;
    case "image":
      return "";
  }
}

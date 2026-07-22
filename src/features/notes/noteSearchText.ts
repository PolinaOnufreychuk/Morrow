import type { Note } from "@/types/entities";

/** Extracts the type-specific "content" text used for search matching, on top of the shared `title`. */
export function getNoteSearchText(note: Note): string {
  switch (note.type) {
    case "text":
      return note.body;
    case "checklist":
      return note.items.map((item) => item.text).join(" ");
    case "bookmark":
      return [note.snippet, note.domain, note.url].filter(Boolean).join(" ");
    case "code":
      return [note.code, note.language].filter(Boolean).join(" ");
    case "quote":
      return [note.quote, note.author].filter(Boolean).join(" ");
    case "recipe":
      return note.ingredients.join(" ");
    case "pdf":
      return note.filename;
    case "meeting":
      return [...note.attendees.map((attendee) => attendee.name), ...note.agenda].join(" ");
    case "image":
    case "moodboard":
      return "";
  }
}

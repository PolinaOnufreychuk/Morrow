/** Supabase/PostgREST (and Storage) throw a plain error object, not an
 * `Error` instance — every catch site that does `err instanceof Error`
 * (ConfirmDialog, form submit handlers) was silently swallowing the real
 * message and showing a generic fallback instead. Normalizing at the
 * repository boundary fixes every downstream consumer at once. Accepts both
 * `PostgrestError` and `StorageError` since both just carry a `message`. */
export function toSupabaseError(error: { message: string }): Error {
  return new Error(error.message);
}

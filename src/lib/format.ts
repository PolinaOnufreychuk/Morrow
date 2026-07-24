/** Small presentation helpers shared across feature cards. */

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** "860 KB" / "2.4 MB" — for attachment rows. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

/** "Today" / "Yesterday" / "Nd ago" — for surfaces showing recency, not deadlines. */
export function formatRelativeUpdated(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

/** "Expires in 5 days" / "Expires today" — Archive screen's retention countdown. */
export function formatExpiresIn(archivedAtIso: string, retentionDays: number): string {
  const archivedAt = new Date(archivedAtIso);
  if (Number.isNaN(archivedAt.getTime())) return "";
  const ageDays = (Date.now() - archivedAt.getTime()) / (1000 * 60 * 60 * 24);
  const daysLeft = Math.max(0, Math.ceil(retentionDays - ageDays));
  if (daysLeft <= 0) return "Expires today";
  if (daysLeft === 1) return "Expires in 1 day";
  return `Expires in ${daysLeft} days`;
}

/** Hostname without "www." — the shared "secondary meta" fallback for any resource kind with a URL. */
export function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

import { useLocation } from "react-router-dom";

/** Describes where a "Back to…" link should point and what it should say. */
export interface BackContext {
  path: string;
  label: string;
}

/**
 * Returns the back-navigation context the user actually arrived from (carried
 * via `location.state.back`, set by whichever page linked here), falling back
 * to `fallback` when none is present — e.g. direct URL visit or page refresh,
 * where `location.state` is unavoidably lost.
 */
export function useBackContext(fallback: BackContext): BackContext {
  const location = useLocation();
  const state = location.state as { back?: BackContext } | null;
  return state?.back ?? fallback;
}

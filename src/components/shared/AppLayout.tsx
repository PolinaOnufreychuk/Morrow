import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import heroMeadow from "@/assets/hero-meadow.png";

/**
 * App shell. Full-viewport flex with a page-level background layer; the glass
 * sidebar floats above it and <main> scrolls internally.
 *
 * Per the hi-fi source, the photographic meadow shows ONLY on the dashboard
 * ("/") — every other route renders the warm beige --surface-page. The
 * background lives on the shell container; the blur is only ever applied
 * inside the glass panels, never to the photo itself.
 */
export function AppLayout() {
  const { pathname } = useLocation();
  const isDashboard = pathname === "/";

  return (
    <div
      className="flex h-screen w-full overflow-hidden bg-surface-page bg-cover bg-center"
      style={isDashboard ? { backgroundImage: `url(${heroMeadow})` } : undefined}
    >
      <Sidebar />
      <main className="relative h-full min-w-0 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

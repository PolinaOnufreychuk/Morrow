import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

/**
 * App shell: persistent Sidebar + routed page content. Mounted as the
 * single parent route so the sidebar state survives navigation.
 */
export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-surface-page">
      <Sidebar />
      <main className="min-w-0 flex-1 px-8 py-8 board:px-12">
        <Outlet />
      </main>
    </div>
  );
}

import { type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toast";
import { SidebarProvider } from "@/context/SidebarContext";
import { queryClient } from "./queryClient";

/**
 * Composed app providers, mounted in main.tsx:
 *   QueryClientProvider → SidebarProvider → TooltipProvider → children + Toaster
 *
 * No Zustand (Context + TanStack Query cover all needs) and no theme provider
 * (single fixed theme) — per the architecture brief. The RouterProvider is
 * mounted as `children` from main.tsx.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <TooltipProvider delayDuration={200}>
          {children}
          <Toaster />
        </TooltipProvider>
      </SidebarProvider>
    </QueryClientProvider>
  );
}

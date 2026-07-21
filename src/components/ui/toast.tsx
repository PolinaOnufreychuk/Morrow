import { Toaster as SonnerToaster } from "sonner";

/**
 * Toast renderer — mounted once near the router (see src/app/providers.tsx).
 * Re-skinned via sonner's className hooks to the token system instead of
 * sonner's default look.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "rounded-card border border-border-default bg-surface-card text-text-primary font-body shadow-hover",
          title: "text-[14px] font-medium",
          description: "text-[13px] text-text-secondary",
          actionButton: "bg-sage-900 text-cream-50 rounded-button",
          cancelButton: "bg-cream-100 text-text-secondary rounded-button",
        },
      }}
    />
  );
}

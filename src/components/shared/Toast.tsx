import { toast } from "sonner";

/**
 * Re-export sonner's imperative `toast` API. The visual renderer lives in
 * components/ui/toast.tsx (<Toaster/>), mounted once in providers.tsx.
 * Feature code calls `notify.success(...)` etc. instead of importing sonner
 * directly, keeping one indirection point for future re-skinning.
 */
export const notify = {
  success: (message: string, description?: string) => toast.success(message, { description }),
  error: (message: string, description?: string) => toast.error(message, { description }),
  info: (message: string, description?: string) => toast(message, { description }),
};

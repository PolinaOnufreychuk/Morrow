import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { hostnameOf } from "@/lib/format";
import type { Resource } from "@/types/entities";

export interface ResourcePreviewModalProps {
  resource: Resource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Lightweight read-only preview opened by clicking the Dashboard's Resource card — not a create/edit form, so it skips ModalShell's wider chrome for a tighter popup. */
export function ResourcePreviewModal({ resource, open, onOpenChange }: ResourcePreviewModalProps) {
  const navigate = useNavigate();
  if (!resource) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <div className="mb-4 flex items-center gap-2 pr-8">
          <span className="inline-flex items-center rounded-chip bg-cream-100 px-[10px] py-[5px] text-[11px] font-medium leading-none tracking-[.01em] text-text-secondary">
            {resource.tags[0] ?? "Resource"}
          </span>
          <span className="text-[12px] text-text-tertiary">{hostnameOf(resource.url)}</span>
        </div>

        <h2 className="text-[18px] font-medium text-text-primary">{resource.title}</h2>
        {resource.description && (
          <p className="mt-2 text-[13.5px] leading-[1.5] text-text-secondary">{resource.description}</p>
        )}

        <div className="mt-6 flex justify-end">
          <Button onClick={() => navigate("/resources")}>Open full page →</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

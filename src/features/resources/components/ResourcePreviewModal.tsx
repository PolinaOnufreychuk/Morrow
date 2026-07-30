import { useNavigate } from "react-router-dom";
import { ModalShell } from "@/components/shared/ModalShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { hostnameOf } from "@/lib/format";
import type { Resource } from "@/types/entities";

export interface ResourcePreviewModalProps {
  resource: Resource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Lightweight popup opened by clicking the Dashboard's Resource card — not a create/edit form, but still routes through ModalShell for consistent title typography and close button. Resources are link-first with no per-item detail page, so the primary action opens the real external URL, same as clicking a Resource card elsewhere in the app. */
export function ResourcePreviewModal({ resource, open, onOpenChange }: ResourcePreviewModalProps) {
  const navigate = useNavigate();
  if (!resource) return null;

  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title={resource.title}
      eyebrow={
        <>
          <Badge variant="neutral">{resource.tags[0] ?? "Resource"}</Badge>
          <span className="text-[12px] text-text-tertiary">{hostnameOf(resource.url)}</span>
        </>
      }
      description={resource.description ?? undefined}
      className="max-w-md"
      footer={
        <>
          <Button variant="secondary" className="h-[48px] rounded-[15px]" onClick={() => navigate("/resources")}>
            View in Resources →
          </Button>
          <Button className="h-[48px] rounded-[15px]" onClick={() => window.open(resource.url, "_blank", "noopener,noreferrer")}>
            Open resource ↗
          </Button>
        </>
      }
    >
      {null}
    </ModalShell>
  );
}

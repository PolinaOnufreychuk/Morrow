import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/shared/FormField";
import { ModalSection } from "@/components/shared/ModalSection";
import { useCreateResource } from "../hooks/useResources";

export interface ResourceQuickCreateFormProps {
  projectId: string;
  onCreated: () => void;
}

/**
 * Inline "create new resource, pre-linked to this project" form for the
 * project-details Link-or-Create modal. Always creates a Link resource — the
 * full kind picker lives on the Resources page itself, not nested here.
 */
export function ResourceQuickCreateForm({ projectId, onCreated }: ResourceQuickCreateFormProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const createResource = useCreateResource();

  const handleSubmit = () => {
    if (!title.trim() || !url.trim()) return;
    createResource.mutate(
      {
        kind: "link",
        title: title.trim(),
        url: url.trim(),
        description: description.trim() || null,
        tags: [],
        readingMinutes: null,
        projectId,
      },
      { onSuccess: onCreated },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <ModalSection tone="primary">
        <FormField htmlFor="resource-quick-title" label="Title">
          <Input
            id="resource-quick-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Resource title"
          />
        </FormField>

        <FormField htmlFor="resource-quick-url" label="URL">
          <Input
            id="resource-quick-url"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://…"
          />
        </FormField>

        <FormField htmlFor="resource-quick-description" label="Description" optional>
          <Textarea
            id="resource-quick-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What is this resource about?"
          />
        </FormField>
      </ModalSection>

      <Button
        type="button"
        size="lg"
        fullWidth
        onClick={handleSubmit}
        disabled={!title.trim() || !url.trim() || createResource.isPending}
      >
        Create resource
      </Button>
    </div>
  );
}

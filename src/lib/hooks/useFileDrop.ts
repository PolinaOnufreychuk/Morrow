import { useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from "react";

export interface UseFileDropOptions {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
}

/**
 * Headless drag/hover/click-to-browse mechanics shared by every dropzone in
 * the app (ImageDropzone's single-file case, AddReferenceModal's multi-file
 * case) so both get identical drag-over/leave/drop behavior and never drift
 * apart. Purely behavioral — callers own all visual state/classNames.
 */
export function useFileDrop({ onFiles, accept = "image/*", multiple = false, disabled = false }: UseFileDropOptions) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleFileList = (list: FileList | null) => {
    const files = Array.from(list ?? []);
    if (files.length === 0) return;
    onFiles(multiple ? files : files.slice(0, 1));
  };

  const dropzoneProps = {
    role: "button" as const,
    tabIndex: 0,
    "aria-disabled": disabled,
    onClick: openPicker,
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
      if (!disabled && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        openPicker();
      }
    },
    onDragOver: (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!disabled) setDragging(true);
    },
    onDragLeave: () => setDragging(false),
    onDrop: (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragging(false);
      if (disabled) return;
      handleFileList(event.dataTransfer.files);
    },
  };

  const inputProps = {
    ref: inputRef,
    type: "file" as const,
    accept,
    multiple,
    className: "hidden",
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      handleFileList(event.target.files);
      event.target.value = "";
    },
  };

  return { dragging, inputRef, openPicker, dropzoneProps, inputProps };
}

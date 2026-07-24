import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/queryKeys";
import type { Attachment, AttachmentParentType } from "@/types/entities";
import { deleteAttachment, listAttachments, uploadAttachment } from "../api/attachments.service";

export function useAttachments(parentType: AttachmentParentType, parentId: string) {
  return useQuery({
    queryKey: queryKeys.attachments.forParent(parentType, parentId),
    queryFn: () => listAttachments(parentType, parentId),
    enabled: Boolean(parentId),
  });
}

export function useUploadAttachment(parentType: AttachmentParentType, parentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadAttachment(parentType, parentId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.attachments.forParent(parentType, parentId),
      });
    },
  });
}

export function useDeleteAttachment(parentType: AttachmentParentType, parentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attachment: Attachment) => deleteAttachment(attachment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.attachments.forParent(parentType, parentId),
      });
    },
  });
}

import Image from "next/image";

export interface Attachment {
  name: string;
  url: string;
  contentType?: string;
}

export const PreviewAttachment = ({
  attachment,
  isUploading = false,
}: {
  attachment: Attachment;
  isUploading?: boolean;
}) => {
  const { name, url, contentType } = attachment;

  return (
    <div
      className="group relative size-24 overflow-hidden rounded-xl border bg-muted"
      data-testid="input-attachment-preview"
    >
      {contentType?.startsWith("image") ? (
        <Image
          alt={name ?? "An image attachment"}
          className="size-full object-cover"
          height={64}
          src={url}
          width={64}
          unoptimized
        />
      ) : (
        <div className="flex size-full items-center justify-center text-muted-foreground text-xs">
          File
        </div>
      )}

      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      )}

    </div>
  );
};

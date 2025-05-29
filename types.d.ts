export type MediaType = {
  id: string;
  mediaType: "video" | "image";
  userId: string | null;
  createdAt: Date;
  presignedUrl: string;
  expiresAt: string;
};

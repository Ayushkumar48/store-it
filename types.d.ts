export type MediaType = {
  id: string;
  mediaType: "video" | "image";
  userId: string;
  createdAt: string;
  presignedUrl: string;
  expiresAt: string;
  cloudUrl: string;
};

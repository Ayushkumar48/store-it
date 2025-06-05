export type MediaType = {
  id: string;
  mediaType: "video" | "image";
  userId: string;
  createdAt: string;
  // presignedUrl: string;
  cloudfrontUrl: string;
  // expiresAt: string;
  // cloudUrl: string;
  error?: string;
};

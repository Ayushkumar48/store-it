export type MediaType = {
  id: string;
  mediaType: "video" | "image";
  userId: string;
  createdAt: string;
  cloudfrontUrl: string;
  cloudUrl: string;
  error?: string;
};

type User = {
  id: string;
  name: string;
  username: string;
  password: null;
  createdAt: Date;
};

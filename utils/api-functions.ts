import { MediaType } from "@/types";
import api, { SESSION_NAME } from "@/utils/interceptor";
import { getItemAsync } from "expo-secure-store";

export async function validateSession() {
  const sessionId = await getItemAsync(SESSION_NAME);
  if (!sessionId) {
    return { success: false, message: "Session expired. Please login." };
  }

  const { data } = await api.post("/validate", sessionId);
  return data;
}

export async function loginUser(formData: {
  username: string;
  password: string;
}) {
  const { data } = await api.post("/auth/login", formData);
  return data;
}

export async function signupUser(formData: {
  name: string;
  username: string;
  password: string;
}) {
  const { data } = await api.post("/auth/signup", formData);
  return data;
}

export async function fetchImages({
  pageParam = 1,
  limit = 30,
}: { pageParam?: number; limit?: number } = {}): Promise<{
  media: MediaType[];
  hasMore: boolean;
}> {
  const response = await api.get("/media/list", {
    params: { page: pageParam, limit },
  });
  // Assume backend returns { media: [...], hasMore: true/false }
  return response.data;
}

export async function uploadMedia(formData: FormData): Promise<{
  media: MediaType[];
  message: string;
}> {
  const response = await api.post("/media", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

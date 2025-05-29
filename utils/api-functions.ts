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

export async function fetchImages(): Promise<MediaType[]> {
  const response = await api.get("/media/list");
  return response.data.media;
}

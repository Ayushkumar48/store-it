import axios, { isAxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

export const SESSION_NAME = "accessToken";

const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.BASE_NGROK_URL,
  timeout: 4000,
  headers: { "Content-Type": "application/json" },
});

async function getAccessToken() {
  return await SecureStore.getItemAsync(SESSION_NAME);
}

api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;

export async function validateUser() {
  try {
    const sessionId = await SecureStore.getItemAsync(SESSION_NAME);
    if (sessionId) {
      const { data } = await api.post("/validate", sessionId);
      if (data?.success) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (err) {
    if (isAxiosError(err)) {
      console.error(err?.response?.data);
    } else {
      console.error(err);
    }
    return false;
  }
}

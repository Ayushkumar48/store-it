import axios from "axios";
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

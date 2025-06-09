import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const SESSION_NAME = "accessToken";

const api = axios.create({
  baseURL: "http://20.193.144.141:3000",
  timeout: 0,
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
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

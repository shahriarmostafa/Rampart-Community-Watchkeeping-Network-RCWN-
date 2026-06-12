import axios from "axios";
import { apiBaseUrl } from "@/lib/constants";

export const secureApi = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

secureApi.interceptors.request.use((config) => {
  return config;
});

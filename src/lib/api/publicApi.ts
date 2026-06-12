import axios from "axios";
import { apiBaseUrl } from "@/lib/constants";

export const publicApi = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

import axios from "axios";

const AUTH_TOKEN = import.meta.env.VITE_HOUSECALL_PRO_API_TOKEN;

if (!AUTH_TOKEN) {
  throw new Error("API token is not defined. Set VITE_HOUSECALL_PRO_API_TOKEN in your .env file.");
}

const apiClient = axios.create({
  baseURL: "/api", // Proxy prefix
  headers: {
    Accept: "application/json",
    Authorization: `Token ${AUTH_TOKEN}`,
  },
});

export default apiClient;

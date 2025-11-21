import { getTokens } from "@/utils/storage";
import { API_BASE_URL, ENDPOINTS } from "../config/api";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const tokens = await getTokens();
  options.headers = {
    ...options.headers,
    "Content-Type": "application/json",
    ...(tokens?.access_token ? { Authorization: `Bearer ${tokens.access_token}` } : {}),
  };
  const res = await fetch(`${API_BASE_URL}${url}`, options);
  return res.json();
}

export const loginAPI = (username: string, password: string): Promise<{
  access_token?: string;
  refresh_token?: string;
}> =>
  fetch(`${API_BASE_URL}${ENDPOINTS.LOGIN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  }).then(res => res.json().then(data => data.data));

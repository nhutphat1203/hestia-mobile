import { getTokens } from "@/utils/storage";
import { WS_BASE_URL } from "../config/websocket";



export async function createWebSocket(room: string) {
  const url = `${WS_BASE_URL}?room=${room}`;

  const headers: any = {};

  const tokens = await getTokens();
  if (tokens == null) {
    return null;
  }

  headers["Authorization"] = `Bearer ${tokens.access_token}`;
  // Trong React Native, WebSocket hỗ trợ subprotocol, không hỗ trợ headers trực tiếp
  return new WebSocket(url, tokens ? [`Bearer ${tokens.access_token}`] : undefined);
}

import { closeWebSocket, createWebSocket } from "@/services/websocket";
import { useEffect, useRef, useState } from "react";

export interface Measure {
  t: number;
  h: number;
  p: number;
  lux: number;
}

export interface EnvData {
  roomId: string;
  measure: Measure;
  score: number;
  state: string;
  ts: number;
  meta: {
    seq: number;
    source: string;
    units: Record<string, string>;
  };
}

export type ConnectionStatus = "connecting" | "connected" | "lost";

interface UseEnvironmentData {
  data: EnvData | null;
  connectionStatus: ConnectionStatus;
  isLoading: boolean;
}

const RECONNECT_INTERVAL = 3000;

export function useEnvironmentData(roomId: string): UseEnvironmentData {
  const [data, setData] = useState<EnvData | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let isMounted = true;

    const connectWS = async () => {
      setConnectionStatus("connecting");
      socketRef.current = await createWebSocket(roomId);

      if (!socketRef.current) {
        setConnectionStatus("lost");
        reconnectTimer.current = setTimeout(connectWS, RECONNECT_INTERVAL);
        return;
      }

      socketRef.current.onopen = () => {
        if (!isMounted) return;
        setConnectionStatus("connected");
      };

      socketRef.current.onmessage = (evt) => {
        if (!isMounted) return;
        try {
          let message: string;
          if (typeof evt.data === "string") {
            message = evt.data;
          } else if (evt.data instanceof ArrayBuffer) {
            message = new TextDecoder("utf-8").decode(evt.data);
          } else {
            console.warn("Unknown message type:", typeof evt.data);
            return;
          }

          const json: EnvData = JSON.parse(message.trim());
          setData(json);
          setConnectionStatus("connected");
        } catch (err) {
          console.error("Invalid JSON from WS:", err, "Data:", evt.data);
        }
      };

      socketRef.current.onerror = () => {
        if (!isMounted) return;
        setConnectionStatus("lost");
      };

      socketRef.current.onclose = () => {
        if (!isMounted) return;
        setConnectionStatus("lost");
        reconnectTimer.current = setTimeout(connectWS, RECONNECT_INTERVAL);
      };
    };

    connectWS();

    return () => {
      isMounted = false;
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
      socketRef.current?.close();
      closeWebSocket();
    };
  }, [roomId]);

  return {
    data,
    connectionStatus,
    isLoading: connectionStatus === "connecting" && !data,
  };
}

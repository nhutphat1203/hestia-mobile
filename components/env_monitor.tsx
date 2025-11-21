import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { getTokens } from "../utils/storage";

interface Measure {
  t: number;
  h: number;
  p: number;
  lux: number;
}

interface EnvData {
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

interface EnvMonitorProps {
  roomId: string;
}

export default function EnvMonitor({ roomId }: EnvMonitorProps) {
  const [data, setData] = useState<EnvData | null>(null);
  const ws = useRef<WebSocket | null>(null);
  let reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let isMounted = true;

    const connectWS = async () => {
      const tokens = await getTokens();
      const accessToken = tokens?.access_token;

      ws.current = new WebSocket(
        `ws://192.168.1.9:8082/ws?room=${roomId}&token=${accessToken}`
      );

      ws.current.onopen = () => {
        console.log("WS connected via proxy");
      };

      ws.current.onmessage = (evt) => {
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

          message = message.trim();
          const json: EnvData = JSON.parse(message);
          setData(json);
        } catch (err) {
          console.error("Invalid JSON from WS:", err, "Data:", evt.data);
        }
      };

      ws.current.onerror = (err) => console.error("WS error", err);

      ws.current.onclose = () => {
        console.log("WS closed. Reconnecting in 3s...");
        if (isMounted) {
          reconnectTimer.current = setTimeout(connectWS, 3000);
        }
      };
    };

    connectWS();

    return () => {
      isMounted = false;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      ws.current?.close();
    };
  }, [roomId]);

  if (!data) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading data...</Text>
      </View>
    );
  }

  const { measure, state, score, meta, ts } = data;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Room: {data.roomId}</Text>
      <Text style={[styles.state, state !== "OK" && styles.stateAlert]}>
        State: {state}
      </Text>
      <Text style={styles.score}>Score: {score}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          Temperature: {measure.t} {meta.units.t}
        </Text>
        <Text style={styles.label}>
          Humidity: {measure.h} {meta.units.h}
        </Text>
        <Text style={styles.label}>
          Pressure: {measure.p} {meta.units.p}
        </Text>
        <Text style={styles.label}>
          Lux: {measure.lux} {meta.units.lux}
        </Text>
      </View>

      <Text style={styles.meta}>Source: {meta.source}</Text>
      <Text style={styles.meta}>Sequence: {meta.seq}</Text>
      <Text style={styles.meta}>
        Timestamp: {new Date(ts).toLocaleString()}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 16,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  state: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "green",
  },
  stateAlert: {
    color: "red",
  },
  score: {
    fontSize: 16,
    marginBottom: 12,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
    color: "#555",
  },
});

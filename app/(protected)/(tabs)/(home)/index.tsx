import EnvMonitor from "@/components/env_monitor";
import { useRouter } from "expo-router";
import { ScrollView, Text } from "react-native";

export default function IndexScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 16 }}>
        Welcome Home!
      </Text>

      {/* Render component monitoring */}
      <EnvMonitor roomId="kit-01" />

      {/* Bạn có thể render thêm nhiều component khác */}
    </ScrollView>
  );
}
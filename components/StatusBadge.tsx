import { StyleSheet, Text, View } from "react-native";

interface StatusBadgeProps {
  label: string;
  variant?: "success" | "warning" | "danger" | "info";
  connection?: "Real-time" | "Lost";
}

export function StatusBadge({ label, variant = "info", connection }: StatusBadgeProps) {
  const colors = {
    success: { background: "#E8F5E9", text: "#2E7D32" },
    warning: { background: "#FFF8E1", text: "#F9A825" },
    danger: { background: "#FDECEA", text: "#E53935" },
    info: { background: "#E8EDFC", text: "#3A7AFE" },
  };

  const color = colors[variant];
  const connectionColor = connection === "Real-time" ? "#43A047" : "#E53935";

  return (
    <View style={styles.row}>
      <View style={[styles.badge, { backgroundColor: color.background }]}> 
        <View style={[styles.dot, { backgroundColor: color.text }]} />
        <Text style={[styles.text, { color: color.text }]}>{label}</Text>
      </View>
      {connection && (
        <View style={[styles.connection, { borderColor: connectionColor }]}> 
          <View style={[styles.connectionDot, { backgroundColor: connectionColor }]} />
          <Text style={[styles.connectionText, { color: connectionColor }]}>
            {connection}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginRight: 8,
  },
  text: {
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.2,
  },
  connection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
  },
  connectionDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginRight: 8,
  },
  connectionText: {
    fontWeight: "700",
    fontSize: 14,
  },
});

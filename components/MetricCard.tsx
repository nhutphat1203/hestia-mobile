import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  accentColor?: string;
  delay?: number;
}

export function MetricCard({
  label,
  value,
  unit,
  icon,
  accentColor = "#3A7AFE",
  delay = 0,
}: MetricCardProps) {
  return (
    <Animated.View entering={FadeInUp.delay(delay).springify()} style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: `${accentColor}12` }]}> 
        {icon}
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {value}
          {unit ? <Text style={styles.unit}> {unit}</Text> : null}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 4,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  textWrap: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    color: "#5A6473",
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  value: {
    fontSize: 32,
    color: "#101828",
    fontWeight: "800",
  },
  unit: {
    fontSize: 16,
    color: "#5A6473",
    fontWeight: "600",
  },
});

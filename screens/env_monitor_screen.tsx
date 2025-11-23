import { AnimatedGauge } from "@/components/AnimatedGauge";
import { MetricCard } from "@/components/MetricCard";
import { SkeletonPlaceholder } from "@/components/SkeletonPlaceholder";
import { StatusBadge } from "@/components/StatusBadge";
import { useEnvironmentData } from "@/hooks/useEnvironmentData";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface EnvMonitorScreenProps {
  roomId: string;
}

export function EnvMonitorScreen({ roomId }: EnvMonitorScreenProps) {
  const { data, connectionStatus, isLoading } = useEnvironmentData(roomId);

  const statusVariant = !data
    ? "info"
    : data.state === "OK"
      ? "success"
      : data.state === "WARN"
        ? "warning"
        : "danger";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.subtitle}>Environment Monitor</Text>
            <Text style={styles.title}>{data?.roomId ?? "Loading room"}</Text>
            <Text style={styles.timestamp}>
              {data?.ts ? new Date(data.ts).toLocaleString() : "Syncing in real-time"}
            </Text>
          </View>
          <View style={styles.statusWrap}>
            <StatusBadge
              label={data?.state ? `State: ${data.state}` : "State: --"}
              variant={statusVariant}
              connection={connectionStatus === "connected" ? "Real-time" : "Lost"}
            />
          </View>
        </Animated.View>

        {isLoading || !data ? (
          <View style={styles.skeletonWrap}>
            <SkeletonPlaceholder height={220} radius={24} />
            <SkeletonPlaceholder height={90} />
            <SkeletonPlaceholder height={90} />
            <SkeletonPlaceholder height={120} />
          </View>
        ) : (
          <View style={styles.content}>
            <View style={styles.heroCard}>
              <AnimatedGauge value={data.score} label="Comfort Score" />
              <View style={styles.heroMeta}>
                <Text style={styles.heroTitle}>Real-time quality</Text>
                <Text style={styles.heroSub}>Smart sensing with live telemetry</Text>
              </View>
            </View>

            <View style={styles.metricsGrid}>
              <MetricCard
                label="Temperature"
                value={data.measure.t.toFixed(1)}
                unit={data.meta.units.t}
                icon={<MaterialCommunityIcons name="thermometer" size={24} color="#3A7AFE" />}
                accentColor="#3A7AFE"
              />
              <MetricCard
                label="Humidity"
                value={data.measure.h.toFixed(1)}
                unit={data.meta.units.h}
                icon={<MaterialCommunityIcons name="water" size={24} color="#43A047" />}
                accentColor="#43A047"
                delay={80}
              />
              <MetricCard
                label="Pressure"
                value={data.measure.p.toFixed(1)}
                unit={data.meta.units.p}
                icon={<MaterialCommunityIcons name="gauge" size={24} color="#F9A825" />}
                accentColor="#F9A825"
                delay={120}
              />
              <MetricCard
                label="Light"
                value={data.measure.lux.toFixed(0)}
                unit={data.meta.units.lux}
                icon={<MaterialCommunityIcons name="white-balance-sunny" size={24} color="#E53935" />}
                accentColor="#E53935"
                delay={160}
              />
            </View>

            <Animated.View entering={FadeInDown.delay(120).springify()} style={styles.metaCard}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Data source</Text>
                <Text style={styles.metaValue}>{data.meta.source}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Sequence</Text>
                <Text style={styles.metaValue}>#{data.meta.seq}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Connection</Text>
                <Text style={[styles.metaValue, connectionStatus === "connected" ? styles.successText : styles.dangerText]}>
                  {connectionStatus === "connected" ? "Real-time" : "Reconnecting"}
                </Text>
              </View>
            </Animated.View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  container: {
    padding: 20,
    gap: 14,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 12,
  },
  headerText: {
    flexShrink: 1,
    minWidth: "60%",
  },
  subtitle: {
    color: "#3A7AFE",
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 6,
  },
  timestamp: {
    color: "#6B7280",
    marginTop: 2,
  },
  statusWrap: {
    marginLeft: "auto",
    alignSelf: "flex-start",
  },
  skeletonWrap: {
    marginTop: 16,
  },
  content: {
    gap: 18,
  },
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  heroMeta: {
    marginTop: 10,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  heroSub: {
    color: "#6B7280",
    marginTop: 4,
  },
  metricsGrid: {
    marginTop: 4,
  },
  metaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaLabel: {
    color: "#6B7280",
    fontSize: 14,
  },
  metaValue: {
    color: "#0F172A",
    fontWeight: "700",
    fontSize: 16,
  },
  successText: {
    color: "#43A047",
  },
  dangerText: {
    color: "#E53935",
  },
});

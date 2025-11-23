import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface AnimatedGaugeProps {
  value: number;
  label: string;
  size?: number;
  strokeWidth?: number;
}

export function AnimatedGauge({ value, label, size = 220, strokeWidth = 16 }: AnimatedGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(0);

  useEffect(() => {
    const clamped = Math.max(0, Math.min(100, value));
    progress.value = withTiming(clamped, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, value]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - (circumference * progress.value) / 100,
  }));

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      <View style={styles.shadow} />
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#3A7AFE" stopOpacity="0.95" />
            <Stop offset="1" stopColor="#43A047" stopOpacity="0.95" />
          </LinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gaugeGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
        />
      </Svg>
      <View style={styles.centerContent}>
        <Text style={styles.value}>{Math.round(value)}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  shadow: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 140,
    backgroundColor: "#3A7AFE11",
    shadowColor: "#3A7AFE",
    shadowOpacity: 0.2,
    shadowRadius: 30,
  },
  centerContent: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: 40,
    fontWeight: "800",
    color: "#0F172A",
  },
  label: {
    fontSize: 16,
    color: "#4B5563",
    letterSpacing: 0.4,
  },
});

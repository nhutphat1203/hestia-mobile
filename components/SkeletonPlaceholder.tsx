import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

interface SkeletonPlaceholderProps {
  height: number;
  width?: string | number;
  radius?: number;
}

export function SkeletonPlaceholder({ height, width = "100%", radius = 14 }: SkeletonPlaceholderProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return <Animated.View style={[styles.block, { height, width, borderRadius: radius, opacity }]} />;
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: "#E6EAF3",
    marginBottom: 12,
  },
});

import { useAuth } from "@/hooks/auth_context";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

export default function LogOutScreen() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(250)} style={styles.box}>
        <Text style={styles.text}>Ready to leave?</Text>
        <Text style={styles.subtext}>Your real-time connection will be stopped.</Text>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  box: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
    alignItems: "center",
    gap: 6,
  },
  text: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtext: {
    color: "#6B7280",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#E53935",
    paddingVertical: 14,
    borderRadius: 14,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});

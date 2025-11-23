import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAuth } from "../hooks/auth_context";

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isFormValid = useMemo(() => account.trim() !== "" && password.trim() !== "", [account, password]);

  const handleLogin = async () => {
    setError("");
    if (!isFormValid) {
      setError("Please enter your credentials");
      return;
    }
    try {
      await login(account, password);
    } catch (err) {
      console.error("Login failed", err);
      setError("Unable to sign in. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name="home-automation" size={32} color="#3A7AFE" />
          </View>
          <Text style={styles.brand}>Hestia Control</Text>
        </View>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in with your JWT credentials to continue.</Text>

        <View style={styles.inputWrap}>
          <Text style={styles.label}>Account</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#9CA3AF"
            value={account}
            onChangeText={setAccount}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable style={[styles.button, !isFormValid && styles.buttonDisabled]} onPress={handleLogin} disabled={isLoading || !isFormValid}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.replace("/login")} style={styles.helpRow}>
          <MaterialCommunityIcons name="shield-key" size={18} color="#3A7AFE" />
          <Text style={styles.helpText}>JWT secured access</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 8,
    gap: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconWrap: {
    backgroundColor: "#3A7AFE12",
    padding: 12,
    borderRadius: 14,
  },
  brand: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 8,
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 20,
  },
  inputWrap: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 14,
    fontSize: 16,
    color: "#111827",
  },
  error: {
    color: "#E53935",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#3A7AFE",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
  helpRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
    marginTop: 10,
  },
  helpText: {
    color: "#3A7AFE",
    fontWeight: "700",
  },
});

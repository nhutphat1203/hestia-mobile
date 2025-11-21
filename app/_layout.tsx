import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { AuthProvider } from "../hooks/auth_context";

export default function RootLayout() {
  return (
    <AuthProvider>
      <InternalLayout />
    </AuthProvider>
  );
}

function InternalLayout() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen
          name="(protected)"
          options={{
            headerShown: false,
            animation: "none",
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            animation: "none",
            headerShown: false,
          }}
        />
      </Stack>
    </AuthProvider>
  );
}

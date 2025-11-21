import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import React from "react";

export default function BottomTabsLayout() {
  return (
    <Tabs
      screenOptions={{ tabBarActiveTintColor: "teal" }}
      backBehavior="order"
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          headerShown: false,
          tabBarLabel: "Index",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="numeric-1-box-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          title: "Logout",
          headerShown: true ,
          popToTopOnBlur: true,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="numeric-2-box-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
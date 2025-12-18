import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function AdminTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#DF2B2A",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="shopping-cart" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="bar-chart" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// app/_layout.tsx
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import "../i18n";
import { store } from "../store/store";

export default function Layout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* 👇 Login screen loads first when app opens */}
        <Stack.Screen name="(auth)/login" />

        {/* 👇 Registration page */}
        <Stack.Screen name="(auth)/register" />

        {/* 👇 Main app with bottom tabs (home, cart) */}
        <Stack.Screen name="(tabs)" />
      </Stack>
    </Provider>
  );
}

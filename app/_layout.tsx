// app/_layout.tsx
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import "../i18n";
import { store } from "../store/store";

export default function Layout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Auth */}
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(auth)/register" />

          {/* Role-based tabs */}
          <Stack.Screen name="(tabs-admin)" />
          <Stack.Screen name="(tabs-customer)" />
        </Stack>
      </SafeAreaProvider>
    </Provider>
  );
}

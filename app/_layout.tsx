// app/_layout.tsx
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import "../i18n";
import { store } from "../store/store";

export default function Layout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Bakery Menu" }} />
        <Stack.Screen name="cart" options={{ title: "Your Cart" }} />
      </Stack>
    </Provider>
  );
}

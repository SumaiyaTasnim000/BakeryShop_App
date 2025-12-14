// app/_layout.tsx
import { Slot, useRouter } from "expo-router";
import { Provider } from "react-redux";
import "../i18n";
import { store } from "../store/store";

import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";
import { registerForPushNotificationsAsync } from "../utils/notificationSetup";

export default function Layout() {
  const router = useRouter();
  const responseListener = useRef<any>(null);

  useEffect(() => {
    // Register device for notifications
    registerForPushNotificationsAsync();

    // When notification is tapped
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(() => {
        router.replace("/(tabs)/notification"); // 👈 redirect to notification tab
      });

    return () => {
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <Provider store={store}>
      {/* Slot ensures Expo Router loads child layouts correctly */}
      <Slot />
    </Provider>
  );
}

import axios from "axios";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { API_BASE_URL } from "./apiConfig";

export async function registerForPushNotificationsAsync() {
  try {
    if (!Device.isDevice) {
      console.log("FCM only works on a real device with APK build.");
      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Permission denied for notifications");
      return null;
    }

    // ⭐ REAL FCM TOKEN (only in APK build)
    const pushToken = await Notifications.getDevicePushTokenAsync();
    const token = pushToken.data;

    console.log("🔥 REAL FCM TOKEN:", token);

    // save to backend
    await axios.post(API_BASE_URL + "/api/save-admin-token", { token });

    return token;
  } catch (error) {
    console.log("❌ Notification error:", error);
    return null;
  }
}

import { Platform } from "react-native";

/**
 * 🔁 SWITCH IPs BY COMMENTING / UNCOMMENTING
 */

// 🏢 Office WiFi
const LOCAL_PC_IP = "192.168.0.13";

// 🏠 Home WiFi
//const LOCAL_PC_IP = "192.168.0.146";

const PORT = 5000;

let API_BASE_URL: string;

if (__DEV__ && Platform.OS === "android") {
  // Android Emulator
  API_BASE_URL = `http://10.0.2.2:${PORT}`;
} else {
  // Real device (Expo Go / APK)
  API_BASE_URL = `http://${LOCAL_PC_IP}:${PORT}`;
}

export { API_BASE_URL };

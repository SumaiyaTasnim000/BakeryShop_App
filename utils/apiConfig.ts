import { Platform } from "react-native";

const LOCAL_PC_IP = "192.168.0.13";
const PORT = 5000;

let API_BASE_URL: string;

// 1️⃣ Android Emulator (Expo Go or Dev Build)
if (__DEV__ && Platform.OS === "android") {
  API_BASE_URL = `http://10.0.2.2:${PORT}`;
}
// 2️⃣ Real Android APK (Production OR Development)
else if (Platform.OS === "android") {
  API_BASE_URL = `http://${LOCAL_PC_IP}:${PORT}`;
}
// 3️⃣ iOS or Web
else {
  API_BASE_URL = `http://${LOCAL_PC_IP}:${PORT}`;
}

export { API_BASE_URL };

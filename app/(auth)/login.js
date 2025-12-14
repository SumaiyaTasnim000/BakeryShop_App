import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { API_BASE_URL } from "../../utils/apiConfig";
import { registerForPushNotificationsAsync } from "../../utils/notificationSetup";

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import InputField from "../../components/InputField";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // 🔴 You can remove this old one:
  // Alert.alert("API DEBUG", API_BASE_URL);

  const handleLogin = async () => {
    // ✅ DEBUG 1: show what URL the app will call
    const url = API_BASE_URL + "/api/auth/login";
    Alert.alert("CALLING", url);
    console.log("AXIOS CALL →", url);

    if (!email || !password) {
      Alert.alert("Missing Info", "Please enter both email and password!");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(url, {
        email,
        password,
      });

      const { role } = res.data;
      if (role === "admin") {
        await registerForPushNotificationsAsync();
        console.log("✅ Admin FCM registered");
      }
      // success → navigate
      router.replace("/(tabs)/home");
    } catch (err) {
      console.log("AXIOS ERROR:", err);
      Alert.alert("❌ Error", "Login failed!\n" + JSON.stringify(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Login to Sora's Bakery (v2)</Text>

        <InputField placeholder="Email" value={email} onChangeText={setEmail} />
        <InputField
          placeholder="Password"
          secure
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Don’t have an account?{" "}
          <Text
            style={styles.link}
            onPress={() => router.push("/(auth)/register")}
          >
            Register
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  container: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#DF2B2A",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#DF2B2A",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerText: {
    textAlign: "center",
    marginTop: 20,
    color: "#444",
  },
  link: {
    color: "#DF2B2A",
    fontWeight: "bold",
  },
});

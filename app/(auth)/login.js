import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import InputField from "../../components/InputField";
import { API_BASE_URL } from "../../config/apiconfig";
import { setRole } from "../../store/userSlice";

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Info", "Please enter both email and password!");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      const { role } = res.data; // 👈 extract role from backend response

      // 👇 SAVE ROLE IN REDUX
      dispatch(setRole(role));

      // 👇 NAVIGATE AFTER STATE IS SET
      if (role === "admin") {
        router.replace("/(tabs-admin)/home");
      } else {
        router.replace("/(tabs-customer)/home");
      }
    } catch (err) {
      console.log(err.response?.data);
      Alert.alert("❌ Error", err.response?.data?.message || "Login failed!");
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
        <Text style={styles.title}>Sora's Bakery Login</Text>

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

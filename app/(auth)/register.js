import axios from "axios";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import InputField from "../../components/InputField";

export default function RegisterScreen({ navigation }) {
  // ---- State ----
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ---- Handlers ----
  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Missing Information", "All fields are required!");
      return;
    }

    setLoading(true);

    try {
      const BASE_URL = "http://10.0.2.2:5000/api/auth/register";

      const res = await axios.post(BASE_URL, {
        name,
        email,
        password,
      });

      Alert.alert("✅ Success", res.data.message);
      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      // Navigate to login screen
      navigation.navigate("login");
    } catch (err) {
      console.log(err.response?.data);
      Alert.alert(
        "❌ Error",
        err.response?.data?.message || "Registration failed!"
      );
    } finally {
      setLoading(false);
    }
  };

  // ---- UI ----
  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>

        <InputField
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
        <InputField placeholder="Email" value={email} onChangeText={setEmail} />
        <InputField
          placeholder="Password"
          secure
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Registering..." : "Register"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("login")}
          >
            Login
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

// ---- Styles ----
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

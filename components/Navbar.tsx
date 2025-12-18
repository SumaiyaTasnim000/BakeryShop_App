import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import i18n from "../i18n";

export default function Navbar() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const router = useRouter();

  useEffect(() => {
    const handleLangChange = () => setCurrentLang(i18n.language);
    i18n.on("languageChanged", handleLangChange);
    return () => i18n.off("languageChanged", handleLangChange);
  }, []);

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.navbar}>
        {/* ☰ Menu (LEFT) */}
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={26} color="#fff" />
        </TouchableOpacity>

        {/* 🧁 Brand (CENTER) */}
        <View style={styles.brand}>
          <Image
            source={require("../assets/images/Bakery_logo.jpg")}
            style={styles.logo}
          />
          <Text style={styles.title}>{i18n.t("app.title")}</Text>
        </View>

        {/* Spacer (RIGHT) to balance menu icon */}
        <View style={{ width: 26 }} />
      </View>

      {/* ⚙️ Settings Modal */}
      <Modal transparent visible={menuVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.menuBox}>
            <Text style={styles.menuTitle}>
              ⚙️ {currentLang === "en" ? "Settings" : "সেটিংস"}
            </Text>

            <TouchableOpacity
              style={styles.languageButton}
              onPress={() =>
                i18n.changeLanguage(currentLang === "en" ? "bn" : "en")
              }
            >
              <Text style={styles.languageText}>
                {currentLang === "en" ? "বাংলা" : "English"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageButton,
                { marginTop: 10, backgroundColor: "#DF2B2A" },
              ]}
              onPress={() => {
                setMenuVisible(false);
                router.push("/(auth)/login");
              }}
            >
              <Text style={styles.languageText}>
                {currentLang === "en" ? "Logout" : "লগআউট"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMenuVisible(false)}
              style={styles.closeButton}
            >
              <Text style={{ color: "#fff" }}>
                {currentLang === "en" ? "Close" : "বন্ধ করুন"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#d35400",
  },

  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 6, // ✅ slim navbar
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  logo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    resizeMode: "cover",
  },

  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  /* Modal styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  menuBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 220,
    alignItems: "center",
  },

  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  languageButton: {
    padding: 10,
    backgroundColor: "#d35400",
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },

  languageText: {
    color: "#fff",
    fontWeight: "bold",
  },

  closeButton: {
    marginTop: 15,
    backgroundColor: "#555",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
});

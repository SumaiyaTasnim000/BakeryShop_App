// components/Navbar.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import i18n from "../i18n";

export default function Navbar() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const router = useRouter();

  // 🆕 Track language changes and re-render
  useEffect(() => {
    const handleLangChange = () => setCurrentLang(i18n.language);
    i18n.on("languageChanged", handleLangChange);
    return () => i18n.off("languageChanged", handleLangChange);
  }, []);

  return (
    <View style={styles.navbar}>
      {/* Left side: sandwich menu */}
      <TouchableOpacity onPress={() => setMenuVisible(true)}>
        <Ionicons name="menu" size={28} color="#fff" />
      </TouchableOpacity>

      {/* ✅ Center title now updates dynamically */}
      <Text style={styles.title}>{i18n.t("app.title")}</Text>

      {/* Right side: cart icon */}
      <TouchableOpacity onPress={() => router.push("/cart")}>
        <Ionicons name="cart" size={26} color="#fff" />
      </TouchableOpacity>

      {/* Modal for dropdown menu */}
      <Modal transparent visible={menuVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.menuBox}>
            {/* ✅ Settings title also localized */}
            <Text style={styles.menuTitle}>
              ⚙️ {i18n.t(currentLang === "en" ? "Settings" : "সেটিংস")}
            </Text>

            {/* ✅ Language toggle */}
            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => {
                const newLang = currentLang === "en" ? "bn" : "en";
                i18n.changeLanguage(newLang);
              }}
            >
              <Text style={styles.languageText}>
                {currentLang === "en" ? "বাংলা" : "English"}
              </Text>
            </TouchableOpacity>

            {/* ✅ Close button localized */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: "#d35400",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
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
  languageText: { color: "#fff", fontWeight: "bold" },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#555",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
});

import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { clearCartAfterCheckout } from "../store/cartSlice";
import { RootState } from "../store/store";

export default function Cart() {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert("Empty Cart", "Your cart is empty!");
      return;
    }

    dispatch(clearCartAfterCheckout());
    Alert.alert("Success", "Checkout complete! Thank you for your order 🍰");

    // ✅ Safely navigate back
    try {
      if (router.canGoBack()) {
        router.back();
      } else {
        // Always push with a delay to ensure stack is ready
        setTimeout(() => {
          router.replace("/");
        }, 200);
      }
    } catch (err) {
      console.log("Navigation error:", err);
      router.replace("/"); // fallback
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🛒 Your Cart</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>৳{item.price}</Text>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                // ✅ If user came from somewhere, go back
                if (router.canGoBack()) {
                  router.back();
                } else {
                  // ✅ Otherwise, safely go to the menu (index)
                  router.replace("/");
                }
              }}
            >
              <Text style={styles.buttonText}>← Back</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 30, color: "gray" }}>
            Your cart is empty 😔
          </Text>
        }
      />

      {/* ✅ Button row for navigation and checkout */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>← Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.checkoutButton,
            cartItems.length === 0 && { backgroundColor: "#ccc" },
          ]}
          onPress={handleCheckout}
          disabled={cartItems.length === 0}
        >
          <Text style={styles.buttonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  name: { fontSize: 18, fontWeight: "500" },
  price: { fontSize: 16, color: "gray", marginBottom: 5 },
  removeButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  removeText: { color: "#fff", fontWeight: "bold" },

  // 🔹 Bottom buttons
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  backButton: {
    backgroundColor: "#999",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  checkoutButton: {
    backgroundColor: "#d35400",
    padding: 10,
    borderRadius: 8,
    flex: 2,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

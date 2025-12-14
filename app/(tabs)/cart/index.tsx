import axios from "axios";
import { useRouter } from "expo-router";
import React from "react";
import { Image } from "react-native";
import { removeItem } from "../../../store/cartSlice";
import { API_BASE_URL } from "../../../utils/apiConfig";

import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { clearCartAfterCheckout } from "../../../store/cartSlice";
import { RootState } from "../../../store/store";
interface GroupedCartItem {
  id: string;
  name: string;
  price: number;
  image?: any;
  quantity: number;
}

export default function Cart() {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  // Calculate total bill
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);
  // Group items so duplicates become one item with a quantity
  const groupedItems: GroupedCartItem[] = Object.values(
    cartItems.reduce((acc: any, item) => {
      if (!acc[item.id]) {
        acc[item.id] = { ...item, quantity: 0 };
      }
      acc[item.id].quantity += 1;
      return acc;
    }, {})
  );
  const handleCheckout = async () => {
    console.log("Checkout button tapped!!!");
    if (cartItems.length === 0) {
      Alert.alert("Empty Cart", "Your cart is empty!");
      return;
    }

    try {
      // Prepare grouped items for backend
      const itemsToSend = groupedItems.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const total = totalAmount;

      // 🔥 Send order to backend (IMPORTANT FIX)
      const res = await axios.post(API_BASE_URL + "/api/place-order", {
        items: itemsToSend,
        total: total,
      });

      console.log("Order Response:", res.data);

      dispatch(clearCartAfterCheckout());
      Alert.alert("Success", "Checkout complete! Thank you for your order 🍰");

      router.replace("/(tabs)/home");
    } catch (err) {
      console.log("Checkout error:", err);
      Alert.alert("❌ Error", "Order could not be placed!");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <Text style={styles.header}>🛒 Your Cart</Text>

        <FlatList
          data={groupedItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Image */}
              {item.image && (
                <Image source={item.image} style={styles.itemImage} />
              )}

              {/* Name & Price */}
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>৳{item.price}</Text>

              {/* Correct Quantity */}
              <Text style={styles.qtyText}>Quantity: {item.quantity}</Text>

              {/* Remove entire item group */}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => {
                  dispatch(removeItem(item.id)); // remove ALL copies
                }}
              >
                <Text style={styles.removeText}>Remove Item</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 30, color: "gray" }}>
              Your cart is empty 😔
            </Text>
          }
        />

        {/* 🔥 Total Bill Section */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>৳{totalAmount}</Text>
        </View>

        {/* ✅ Button row for navigation and checkout */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/(tabs)/home")}
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
    </SafeAreaView>
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
    alignSelf: "center",
    marginTop: 10,
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
  itemImage: {
    width: "100%",
    height: 140,
    borderRadius: 10,
    marginBottom: 10,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginBottom: 10,
    //textAlign: "center",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#d35400",
  },
});

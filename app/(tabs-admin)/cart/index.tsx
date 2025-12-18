import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../../components/Navbar";
import { API_BASE_URL } from "../../../config/apiconfig";
import {
  clearCartAfterCheckout,
  decreaseQty,
  increaseQty,
  removeItem,
} from "../../../store/cartSlice";
import { RootState } from "../../../store/store";

export default function Cart() {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Empty Cart", "Your cart is empty!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/print`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,
          total: totalAmount,
        }),
      });

      if (!response.ok) {
        throw new Error("Print failed");
      }

      dispatch(clearCartAfterCheckout());
      Alert.alert("Success", "Receipt printed 🖨️");
      router.replace("../home");
    } catch (err) {
      Alert.alert("Error", "Could not print receipt");
      console.error(err);
    }
  };

  return (
    <View style={styles.root}>
      <Navbar />

      <View style={styles.container}>
        <Text style={styles.header}>🛒 Your Cart</Text>

        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.image && <Image source={item.image} style={styles.image} />}

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>৳{item.price}</Text>

                <View style={styles.qtyRow}>
                  <TouchableOpacity
                    onPress={() => dispatch(decreaseQty(item.id))}
                  >
                    <Text style={styles.qtyBtn}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.qty}>{item.quantity}</Text>

                  <TouchableOpacity
                    onPress={() => dispatch(increaseQty(item.id))}
                  >
                    <Text style={styles.qtyBtn}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity onPress={() => dispatch(removeItem(item.id))}>
                <Text style={styles.remove}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>Your cart is empty 😔</Text>
          }
          contentContainerStyle={{ paddingBottom: 140 }}
        />

        <View style={styles.bottom}>
          <Text style={styles.total}>Total: ৳{totalAmount}</Text>

          <TouchableOpacity
            style={[
              styles.checkout,
              cartItems.length === 0 && { backgroundColor: "#ccc" },
            ]}
            onPress={handleCheckout}
            disabled={cartItems.length === 0}
          >
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12, // 👈 FIXED (was too high before)
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
  },

  name: { fontSize: 16, fontWeight: "600" },
  price: { fontSize: 14, color: "gray" },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  qtyBtn: {
    fontSize: 22,
    color: "#d35400",
    paddingHorizontal: 10,
  },

  qty: { fontSize: 16 },

  remove: {
    fontSize: 18,
    color: "red",
    padding: 6,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "gray",
  },

  bottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
    padding: 16,
  },

  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  checkout: {
    backgroundColor: "#d35400",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  checkoutText: {
    color: "#fff",
    fontSize: 16,
  },
});

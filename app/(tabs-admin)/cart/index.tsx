import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
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
  const [showPreview, setShowPreview] = React.useState(false);

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
            onPress={() => setShowPreview(true)}
            disabled={cartItems.length === 0}
          >
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal visible={showPreview} animationType="slide" transparent>
        <View style={styles.previewOverlay}>
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>🧾 Receipt Preview</Text>

            <Text style={styles.previewDate}>
              {new Date().toLocaleString()}
            </Text>

            <View style={styles.previewDivider} />

            {cartItems.map((item) => (
              <View key={item.id} style={styles.previewRow}>
                <Text style={styles.previewName}>
                  {item.name} x{item.quantity}
                </Text>
                <Text style={styles.previewPrice}>
                  ৳{item.price * item.quantity}
                </Text>
              </View>
            ))}

            <View style={styles.previewDivider} />

            <Text style={styles.previewTotal}>TOTAL: ৳{totalAmount}</Text>

            <View style={styles.previewActions}>
              <TouchableOpacity
                style={styles.previewCancel}
                onPress={() => setShowPreview(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.previewConfirm}
                onPress={() => {
                  setShowPreview(false);
                  handleCheckout();
                }}
              >
                <Text style={{ color: "#fff" }}>Confirm & Print</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  previewOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  previewCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },

  previewTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },

  previewDate: {
    textAlign: "center",
    color: "gray",
    marginBottom: 10,
  },

  previewDivider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },

  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  previewName: {
    fontSize: 15,
  },

  previewPrice: {
    fontSize: 15,
    fontWeight: "600",
  },

  previewTotal: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 16,
  },

  previewActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  previewCancel: {
    padding: 12,
    flex: 1,
    alignItems: "center",
  },

  previewConfirm: {
    padding: 12,
    flex: 1,
    backgroundColor: "#d35400",
    alignItems: "center",
    borderRadius: 8,
    marginLeft: 10,
  },
});

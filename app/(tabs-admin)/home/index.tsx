//C:\Users\X1 CARBON\bakery-app\app\(tabs)\home\index.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import Navbar from "../../../components/Navbar";

import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { API_BASE_URL } from "../../../config/apiconfig";
import { addToCart, increaseQty } from "../../../store/cartSlice";

/* ------------------ DATA ------------------ */

const sweetItems = [
  {
    id: "1",
    name: "Chocolate Cake",
    price: 300,
    image: require("../../../assets/images/Chocolate Cake.jpg"),
  },
  {
    id: "2",
    name: "Strawberry Tart",
    price: 220,
    image: require("../../../assets/images/Strawberry Tart.jpg"),
  },
  {
    id: "3",
    name: "Cupcake",
    price: 80,
    image: require("../../../assets/images/Cupcake.jpg"),
  },
];

const savoryItems = [
  {
    id: "4",
    name: "Veg Roll",
    price: 100,
    image: require("../../../assets/images/vegroll.jpg"),
  },
  {
    id: "5",
    name: "Cheese Roll",
    price: 300,
    image: require("../../../assets/images/cheese_roll.jpg"),
  },
  {
    id: "6",
    name: "Garlic Bread",
    price: 190,
    image: require("../../../assets/images/garlic_bread.jpg"),
  },
];

/* ------------------ SCREEN ------------------ */

export default function Home() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const increaseInputQty = (id: string) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  };

  const decreaseInputQty = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] ?? 0) - 1, 0),
    }));
  };
  const [bestSelling, setBestSelling] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/stats/top-products`)
      .then((res) => res.json())
      .then((rows) => {
        const allItems = [...sweetItems, ...savoryItems];

        const mapped = rows
          .map((row: any) =>
            allItems.find((item) => item.id === String(row.id))
          )
          .filter(Boolean);

        setBestSelling(mapped);
      })
      .catch(console.error);
  }, []);

  const handleAddToCart = (item: any) => {
    const qty = quantities[item.id] ?? 0;

    if (qty === 0) {
      Alert.alert("Quantity required", "Please select at least 1 item.");
      return;
    }

    dispatch(addToCart(item));
    for (let i = 1; i < qty; i++) {
      dispatch(increaseQty(item.id));
    }

    Alert.alert(t("app.menu"), t("app.successAdded", { qty, item: item.name }));
    setQuantities((prev) => ({ ...prev, [item.id]: 0 }));
  };

  const renderSection = (title: string, data: any[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => {
          const qty = quantities[item.id] ?? 0;

          return (
            <View style={styles.card}>
              {item.image && (
                <Image source={item.image} style={styles.itemImage} />
              )}

              <Text style={styles.name}>{t(`items.${item.name}`)}</Text>
              <Text style={styles.price}>৳{item.price}</Text>

              <View style={styles.qtyContainer}>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => decreaseInputQty(item.id)}
                >
                  <Text style={styles.qtyText}>−</Text>
                </TouchableOpacity>

                <TextInput
                  style={styles.qtyInput}
                  keyboardType="number-pad"
                  value={String(qty)}
                  onChangeText={(text) => {
                    const num = text.replace(/[^0-9]/g, "");
                    setQuantities((prev) => ({
                      ...prev,
                      [item.id]: num === "" ? 0 : parseInt(num, 10),
                    }));
                  }}
                />

                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => increaseInputQty(item.id)}
                >
                  <Text style={styles.qtyText}>+</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                disabled={qty === 0}
                onPress={() => handleAddToCart(item)}
                style={[styles.addButton, qty === 0 && styles.disabledButton]}
              >
                <Text style={styles.addText}>{t("app.addToCart")}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Navbar />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        {renderSection(t("app.sweet"), sweetItems)}
        {renderSection(t("app.savory"), savoryItems)}
        {bestSelling.length > 0 &&
          renderSection(t("app.bestSelling"), bestSelling)}
      </ScrollView>
    </View>
  );
}

/* ------------------ STYLES ------------------ */

const styles = StyleSheet.create({
  section: { marginBottom: 25 },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#d35400",
  },

  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },

  itemImage: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "cover",
  },

  name: { fontSize: 18, fontWeight: "500" },
  price: { fontSize: 16, color: "gray", marginBottom: 5 },

  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },

  qtyButton: {
    backgroundColor: "#d35400",
    borderRadius: 5,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  qtyText: { color: "white", fontSize: 18 },

  qtyInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    width: 50,
    height: 42,
    textAlign: "center",
    fontSize: 16,
    marginHorizontal: 8,
    paddingVertical: 6,
    includeFontPadding: false,
    textAlignVertical: "center",
  },

  addButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginTop: 6,
  },

  disabledButton: {
    backgroundColor: "#ccc",
  },

  addText: {
    color: "white",
    fontWeight: "bold",
  },
});

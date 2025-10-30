import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import Navbar from "../components/Navbar";

import {
  Button,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { selectBestSellers } from "../store/selectors";
import { RootState } from "../store/store";

const sweetItems = [
  {
    id: "1",
    name: "Chocolate Cake",
    price: 300,
    image: require("../assets/images/Chocolate Cake.jpg"),
  },
  {
    id: "2",
    name: "Strawberry Tart",
    price: 220,
    image: require("../assets/images/Strawberry Tart.jpg"),
  },
  {
    id: "3",
    name: "Cupcake",
    price: 80,
    image: require("../assets/images/Cupcake.jpg"),
  },
];

const savoryItems = [
  { id: "4", name: "Veg Roll", price: 100 },
  { id: "5", name: "Cheese Roll", price: 300 },
  { id: "6", name: "Garlic Bread", price: 190 },
];

export default function Home() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  // ✅ Combine all items for Best Sellers logic
  const allItems = [...sweetItems, ...savoryItems];

  // ✅ Dynamically get best sellers from Redux
  const bestSellers = useSelector((state: RootState) =>
    selectBestSellers(state, allItems)
  );

  const increaseQty = (id: string) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decreaseQty = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 0 ? prev[id] - 1 : 0,
    }));
  };

  const handleAddToCart = (item: any) => {
    const qty = quantities[item.id] || 1;
    for (let i = 0; i < qty; i++) dispatch(addToCart(item));
    Alert.alert(t("app.menu"), t("app.successAdded", { qty, item: item.name }));
  };

  const renderSection = (title: string, data: any[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.image && (
              <Image source={item.image} style={styles.itemImage} />
            )}
            <Text style={styles.name}>{t(`items.${item.name}`)}</Text>
            <Text style={styles.price}>৳{item.price}</Text>

            <View style={styles.qtyContainer}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => decreaseQty(item.id)}
              >
                <Text style={styles.qtyText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantities[item.id] || 0}</Text>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => increaseQty(item.id)}
              >
                <Text style={styles.qtyText}>+</Text>
              </TouchableOpacity>
            </View>

            <Button
              title={t("app.addToCart")}
              onPress={() => handleAddToCart(item)}
            />
          </View>
        )}
      />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* ✅ Fixed Top Navbar */}
      <Navbar />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        decelerationRate="normal" // ✅ slows scroll speed (default is 'fast' on Android)
        scrollEventThrottle={16}
        overScrollMode="never"
      >
        {renderSection(t("app.sweet"), sweetItems)}
        {renderSection(t("app.savory"), savoryItems)}
        {renderSection(t("app.bestSelling"), bestSellers)}
      </ScrollView>
    </View>
  );
}

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
  name: { fontSize: 18, fontWeight: "500" },
  price: { fontSize: 16, color: "gray", marginBottom: 5 },
  qtyContainer: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  qtyButton: {
    backgroundColor: "#d35400",
    borderRadius: 5,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: { color: "white", fontSize: 18 },
  qtyValue: { marginHorizontal: 10, fontSize: 16 },
  itemImage: {
    width: "100%",
    height: 160, // ✅ good height balance for card layout
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "cover", // ✅ fills nicely without stretching
  },

  imageContainer: {
    width: "100%",
    aspectRatio: 1.2, // maintains consistent shape
    overflow: "hidden",
    borderRadius: 10,
    marginBottom: 10,
  },
  cartButton: {
    position: "absolute",
    top: 40, // adjust if it overlaps your logo or header
    right: 20,
    backgroundColor: "#d35400",
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5, // shadow for Android
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 80, // ✅ ensures Sweet section starts below navbar
  },
});

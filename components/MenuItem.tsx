import React from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MenuItemProps {
  item: { id: string; name: string; price: number; image?: any };
  quantity: number;
  onAdd: (item: any) => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
}

export default function MenuItem({
  item,
  quantity,
  onAdd,
  onIncrease,
  onDecrease,
}: MenuItemProps) {
  return (
    <View style={styles.card}>
      {item.image && <Image source={item.image} style={styles.image} />}
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.price}>৳{item.price}</Text>

      <View style={styles.qtyContainer}>
        <TouchableOpacity
          style={styles.qtyButton}
          onPress={() => onDecrease(item.id)}
        >
          <Text style={styles.qtyText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.qtyValue}>{quantity}</Text>
        <TouchableOpacity
          style={styles.qtyButton}
          onPress={() => onIncrease(item.id)}
        >
          <Text style={styles.qtyText}>+</Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Add to Cart"
        onPress={() =>
          onAdd({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "cover",
  },
  title: { fontSize: 18, fontWeight: "bold" },
  price: { fontSize: 16, color: "gray", marginBottom: 5 },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
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
  qtyValue: { marginHorizontal: 10, fontSize: 16 },
});

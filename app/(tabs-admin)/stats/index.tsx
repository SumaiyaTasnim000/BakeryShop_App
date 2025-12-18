import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Navbar from "../../../components/Navbar";
import { API_BASE_URL } from "../../../config/apiconfig";

export default function Stats() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/stats/sales`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <View style={styles.root}>
      <Navbar />

      <View style={styles.container}>
        <Text style={styles.title}>📊 Sales Statistics</Text>

        {data.length === 0 ? (
          <Text style={styles.empty}>No sales recorded yet</Text>
        ) : (
          data.map((item) => (
            <Text key={item.id} style={styles.item}>
              ⭐ {item.name} → Sold {item.sold}
            </Text>
          ))
        )}
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
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  empty: {
    textAlign: "center",
    color: "gray",
    marginTop: 40,
  },
  item: {
    fontSize: 16,
    marginBottom: 8,
  },
});

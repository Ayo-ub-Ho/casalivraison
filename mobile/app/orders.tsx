import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";

interface Order {
  id: string;
  number: string;
  date: string;
  status: "pending" | "processing" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export default function OrdersPage() {
  const [orders] = useState<Order[]>([
    {
      id: "1",
      number: "#ORD-001",
      date: "2024-01-15",
      status: "delivered",
      total: 45.99,
      items: [
        { id: "1", name: "Margherita Pizza", quantity: 1, price: 12.99 },
        { id: "2", name: "Caesar Salad", quantity: 2, price: 8.5 },
      ],
    },
    {
      id: "2",
      number: "#ORD-002",
      date: "2024-01-20",
      status: "processing",
      total: 32.5,
      items: [{ id: "3", name: "Burger Combo", quantity: 1, price: 15.99 }],
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "#4CAF50";
      case "processing":
        return "#2196F3";
      case "pending":
        return "#FF9800";
      case "cancelled":
        return "#F44336";
      default:
        return "#999";
    }
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>{item.number}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.itemsCount}>{item.items.length} items</Text>
      <Text style={styles.total}>${item.total.toFixed(2)}</Text>
      <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.viewButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
        <Text style={styles.subtitle}>{orders.length} orders</Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  status: {
    fontSize: 12,
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  itemsCount: {
    fontSize: 12,
    color: "#666",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 12,
  },
  viewButton: {
    backgroundColor: "#2196F3",
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: "center",
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

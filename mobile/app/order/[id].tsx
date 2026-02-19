import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { api } from "../../src/api/client";
import { COLORS } from "../../src/config/constants";

type Order = any;

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    api
      .get(`/api/orders/${id}`)
      .then((res) => {
        console.log(res.data);
        setOrder(res.data);
      })
      .catch((e) => console.log(e?.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text>Commande introuvable</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen options={{ title: "Détail commande" }} />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: "900" }}>
          {order.Restaurant?.name}
        </Text>

        <Text style={{ marginTop: 6, color: COLORS.muted }}>
          {new Date(order.createdAt).toLocaleString()}
        </Text>

        <Text style={{ marginTop: 10, fontWeight: "900" }}>
          Statut : {order.status}
        </Text>

        <View style={{ marginTop: 16 }}>
          {order.OrderItems?.map((item: any) => (
            <View
              key={item.id}
              style={{
                padding: 12,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: "#eee",
                marginBottom: 10,
              }}
            >
              <Text style={{ fontWeight: "900" }}>{item.MenuItem?.name}</Text>

              <Text style={{ marginTop: 4, color: COLORS.muted }}>
                {item.quantity} × {item.unitPrice} MAD
              </Text>

              <Text style={{ marginTop: 6, fontWeight: "900" }}>
                {item.totalPrice} MAD
              </Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: "900" }}>
            Livraison : {order.deliveryFee} MAD
          </Text>
          <Text style={{ fontWeight: "900", marginTop: 6 }}>
            Total : {order.total} MAD
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

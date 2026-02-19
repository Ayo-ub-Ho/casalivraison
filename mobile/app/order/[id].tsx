import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { api } from "../../src/api/client";
import { COLORS } from "../../src/config/constants";
import Card from "../../src/components/Card";
import StatusBadge from "../../src/components/StatusBadge";

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
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <Stack.Screen options={{ title: "Commande" }} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <Card>
          <Text style={{ fontSize: 20, fontWeight: "900" }}>
            {order.Restaurant?.name}
          </Text>

          <Text style={{ marginTop: 6, color: COLORS.muted }}>
            {new Date(order.createdAt).toLocaleString()}
          </Text>

          <View style={{ marginTop: 12 }}>
            <StatusBadge status={order.status} />
          </View>
        </Card>

        <View style={{ height: 16 }} />

        <Card>
          {order.OrderItems?.map((item: any) => (
            <View key={item.id} style={{ marginBottom: 14 }}>
              <Text style={{ fontWeight: "900" }}>{item.MenuItem?.name}</Text>

              <Text style={{ marginTop: 4, color: COLORS.muted }}>
                {item.quantity} × {item.unitPrice} MAD
              </Text>

              <Text style={{ marginTop: 6, fontWeight: "900" }}>
                {item.totalPrice} MAD
              </Text>
            </View>
          ))}
        </Card>

        <View style={{ height: 16 }} />

        <Card>
          <Row label="Produits" value={`${order.subtotal} MAD`} />
          <Row label="Livraison" value={`${order.deliveryFee} MAD`} />
          <View
            style={{
              height: 1,
              backgroundColor: COLORS.border,
              marginVertical: 10,
            }}
          />
          <Row label="Total" value={`${order.total} MAD`} bold />
        </Card>
      </ScrollView>
    </View>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text
        style={{
          color: "#333",
          fontWeight: bold ? "900" : "700",
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          fontWeight: bold ? "900" : "700",
        }}
      >
        {value}
      </Text>
    </View>
  );
}

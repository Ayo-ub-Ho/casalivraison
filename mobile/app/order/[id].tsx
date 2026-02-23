import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { api } from "../../src/api/client";
import { COLORS } from "../../src/config/constants";
import StatusBadge from "../../src/components/StatusBadge";

type OrderItem = {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  MenuItem?: { name: string; imageUrl?: string };
};

type Order = {
  id: string;
  status: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  notes?: string;
  dropoffAddressText?: string;
  Restaurant?: { name: string };
  OrderItems?: OrderItem[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-MA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/api/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch((e) => console.log(e?.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
        <Text style={{ fontSize: 40 }}>😕</Text>
        <Text style={{ marginTop: 12, fontSize: 18, fontWeight: "900", color: COLORS.text }}>
          Commande introuvable
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F7F7F7" }}>
      <Stack.Screen options={{ title: "Commande" }} />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Restaurant & Status ─── */}
        <SectionHeader icon="🏪" title="Restaurant" />
        <View style={styles.card}>
          <Text style={{ fontSize: 19, fontWeight: "900", color: COLORS.text }}>
            {order.Restaurant?.name ?? "Restaurant"}
          </Text>
          <Text style={{ marginTop: 6, color: COLORS.muted, fontSize: 13 }}>
            {formatDate(order.createdAt)}
          </Text>
          <View style={{ marginTop: 12 }}>
            <StatusBadge status={order.status} />
          </View>
        </View>

        {/* ─── Items ─── */}
        <SectionHeader icon="🛍️" title="Articles commandés" />
        <View style={styles.card}>
          {order.OrderItems?.map((item, i) => (
            <View key={item.id}>
              {i > 0 && <View style={styles.divider} />}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 10,
                }}
              >
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text
                    style={{ fontWeight: "800", fontSize: 15, color: COLORS.text }}
                  >
                    {item.MenuItem?.name ?? "Article"}
                  </Text>
                  <Text style={{ marginTop: 3, color: COLORS.muted, fontSize: 13 }}>
                    {item.quantity} × {item.unitPrice} MAD
                  </Text>
                </View>
                <Text style={{ fontWeight: "900", fontSize: 15, color: COLORS.text }}>
                  {item.totalPrice ?? item.quantity * item.unitPrice} MAD
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ─── Address ─── */}
        {!!order.dropoffAddressText && (
          <>
            <SectionHeader icon="📍" title="Adresse de livraison" />
            <View style={styles.card}>
              <Text style={{ color: COLORS.text, fontSize: 14, lineHeight: 20 }}>
                {order.dropoffAddressText}
              </Text>
            </View>
          </>
        )}

        {/* ─── Notes ─── */}
        {!!order.notes && (
          <>
            <SectionHeader icon="📝" title="Instructions" />
            <View style={styles.card}>
              <Text style={{ color: COLORS.muted, fontSize: 14, lineHeight: 20 }}>
                {order.notes}
              </Text>
            </View>
          </>
        )}

        {/* ─── Price Summary ─── */}
        <SectionHeader icon="💳" title="Récapitulatif" />
        <View style={styles.card}>
          <SummaryRow label="Sous-total" value={`${order.subtotal ?? 0} MAD`} />
          <SummaryRow label="Frais de livraison" value={`${order.deliveryFee ?? 0} MAD`} />
          <View style={[styles.divider, { marginVertical: 10 }]} />
          <SummaryRow
            label="Total payé"
            value={`${order.total ?? 0} MAD`}
            bold
            highlight
          />
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Sub-components ───────────────────────────────────────────

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 20,
        marginBottom: 8,
      }}
    >
      <Text style={{ fontSize: 16 }}>{icon}</Text>
      <Text style={{ fontSize: 16, fontWeight: "900", color: COLORS.text }}>
        {title}
      </Text>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  bold,
  highlight,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
      }}
    >
      <Text
        style={{
          color: highlight ? COLORS.text : COLORS.muted,
          fontWeight: bold ? "900" : "600",
          fontSize: bold ? 16 : 14,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontWeight: bold ? "900" : "700",
          color: highlight ? COLORS.primary : COLORS.text,
          fontSize: bold ? 16 : 14,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
});

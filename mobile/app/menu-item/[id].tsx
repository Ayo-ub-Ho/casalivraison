import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { api } from "../../src/api/client";
import { COLORS } from "../../src/config/constants";
import { useCartStore } from "../../src/stores/cartStore";

type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
};

export default function MenuItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const [item, setItem] = useState<MenuItem | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  const total = useMemo(() => (item ? item.price * qty : 0), [item, qty]);

  useEffect(() => {
    if (!id) return;
    api
      .get<MenuItem>(`/api/menu-items/${id}`)
      .then((res) => setItem(res.data))
      .catch((e) => console.log("API error:", e?.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Chargement...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text>Item introuvable.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <Stack.Screen options={{ title: item.name }} />

      <Text style={{ fontSize: 22, fontWeight: "900", color: COLORS.text }}>
        {item.name}
      </Text>

      {!!item.description && (
        <Text style={{ marginTop: 10, color: COLORS.muted, fontSize: 14 }}>
          {item.description}
        </Text>
      )}

      <Text style={{ marginTop: 12, fontSize: 18, fontWeight: "900" }}>
        {item.price} MAD
      </Text>

      {/* Quantity */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 18,
          gap: 14,
        }}
      >
        <Pressable
          onPress={() => setQty((q) => Math.max(1, q - 1))}
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            backgroundColor: "#f2f2f2",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "900" }}>−</Text>
        </Pressable>

        <Text style={{ fontSize: 18, fontWeight: "900" }}>{qty}</Text>

        <Pressable
          onPress={() => setQty((q) => q + 1)}
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            backgroundColor: "#f2f2f2",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "900" }}>+</Text>
        </Pressable>
      </View>

      {/* CTA (pour l'instant: juste retour) */}
      <View style={{ flex: 1 }} />

      <Pressable
        onPress={() => {
          addItem(
            {
              menuItemId: item.id,
              name: item.name,
              unitPrice: item.price,
              restaurantId: (item as any).restaurantId, // إذا كانت موجودة
            },
            qty,
          );
          router.back();
        }}
        style={{
          height: 54,
          borderRadius: 16,
          backgroundColor: COLORS.primary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "900" }}>
          Ajouter {qty} pour {total} MAD
        </Text>
      </Pressable>
    </View>
  );
}

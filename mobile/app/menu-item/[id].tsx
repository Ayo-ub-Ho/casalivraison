import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
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
  restaurantId: string;
};

const PLACEHOLDER = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80";

export default function MenuItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const [item, setItem] = useState<MenuItem | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

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
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
        <Text style={{ fontSize: 40 }}>😕</Text>
        <Text style={{ marginTop: 12, fontSize: 18, fontWeight: "900", color: COLORS.text }}>
          Article introuvable
        </Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: COLORS.primary, fontWeight: "700" }}>← Retour</Text>
        </Pressable>
      </View>
    );
  }

  const handleAdd = () => {
    setAdding(true);
    addItem(
      {
        menuItemId: item.id,
        name: item.name,
        unitPrice: item.price,
        restaurantId: item.restaurantId,
      },
      qty
    );
    setTimeout(() => {
      router.back();
    }, 150);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F7F7F7" }}>
      <Stack.Screen options={{ title: item.name, headerTransparent: false }} />

      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Hero Image */}
        <View style={{ height: 280, backgroundColor: "#EEE" }}>
          <Image
            source={{ uri: item.imageUrl || PLACEHOLDER }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            transition={300}
          />
          {/* Availability badge */}
          <View
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              backgroundColor: item.isAvailable ? "#DCFCE7" : "#FEE2E2",
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 999,
            }}
          >
            <Text
              style={{
                fontWeight: "800",
                fontSize: 12,
                color: item.isAvailable ? "#16A34A" : "#DC2626",
              }}
            >
              {item.isAvailable ? "✓ Disponible" : "Indisponible"}
            </Text>
          </View>
        </View>

        {/* Info Card */}
        <View
          style={{
            backgroundColor: "white",
            marginHorizontal: 16,
            marginTop: -20,
            borderRadius: 20,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.07,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "900", color: COLORS.text }}>
            {item.name}
          </Text>

          {!!item.description && (
            <Text style={{ marginTop: 8, color: COLORS.muted, fontSize: 14, lineHeight: 20 }}>
              {item.description}
            </Text>
          )}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 16,
            }}
          >
            <Text style={{ fontSize: 22, fontWeight: "900", color: COLORS.primary }}>
              {item.price} MAD
            </Text>

            {/* Quantity Stepper */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F7F7F7",
                borderRadius: 14,
                overflow: "hidden",
              }}
            >
              <Pressable
                onPress={() => setQty((q) => Math.max(1, q - 1))}
                style={styles.stepperBtn}
              >
                <Text style={styles.stepperIcon}>−</Text>
              </Pressable>

              <Text style={styles.stepperQty}>{qty}</Text>

              <Pressable
                onPress={() => setQty((q) => q + 1)}
                style={styles.stepperBtn}
              >
                <Text style={[styles.stepperIcon, { color: COLORS.primary }]}>+</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Nutritional or extra info placeholder */}
        <View
          style={{
            backgroundColor: "white",
            marginHorizontal: 16,
            marginTop: 12,
            borderRadius: 16,
            padding: 16,
            shadowColor: "#000",
            shadowOpacity: 0.03,
            shadowRadius: 6,
            elevation: 1,
          }}
        >
          <Text style={{ fontWeight: "800", color: COLORS.text, marginBottom: 6 }}>
            Informations
          </Text>
          <Text style={{ color: COLORS.muted, fontSize: 14, lineHeight: 20 }}>
            Article préparé frais à la commande. Livré chaud à votre porte.
          </Text>
        </View>
      </ScrollView>

      {/* ─── Sticky CTA ─── */}
      <View
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 24,
        }}
      >
        <Pressable
          onPress={handleAdd}
          disabled={!item.isAvailable || adding}
          style={({ pressed }) => ({
            height: 60,
            borderRadius: 18,
            backgroundColor: item.isAvailable ? COLORS.primary : "#CCC",
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed || adding || !item.isAvailable ? 0.8 : 1,
            shadowColor: COLORS.primary,
            shadowOpacity: item.isAvailable ? 0.35 : 0,
            shadowRadius: 12,
            elevation: item.isAvailable ? 7 : 0,
            flexDirection: "row",
            gap: 8,
          })}
        >
          <Text style={{ fontSize: 17, fontWeight: "900", color: "white" }}>
            {item.isAvailable ? `Ajouter ${qty > 1 ? qty + " ×" : ""} • ${total} MAD` : "Indisponible"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepperBtn: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperIcon: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.text,
  },
  stepperQty: {
    width: 36,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "900",
    color: COLORS.text,
  },
});

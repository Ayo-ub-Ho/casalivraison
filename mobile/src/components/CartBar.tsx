import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useCartStore } from "../stores/cartStore";
import { COLORS } from "../config/constants";

export default function CartBar() {
  const router = useRouter();
  const count = useCartStore((s) => s.count());
  const subtotal = useCartStore((s) => s.subtotal());

  if (count === 0) return null;

  return (
    <View style={{ position: "absolute", left: 16, right: 16, bottom: 16 }}>
      <Pressable
        onPress={() => router.push("/cart")}
        style={{
          height: 56,
          borderRadius: 16,
          backgroundColor: COLORS.primary,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Text style={{ fontWeight: "900", fontSize: 16 }}>Panier {count}</Text>
        <Text style={{ fontWeight: "900", fontSize: 16 }}>
          {subtotal} MAD →
        </Text>
      </Pressable>
    </View>
  );
}

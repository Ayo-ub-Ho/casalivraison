import React from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useCartStore } from "../src/stores/cartStore";
import { COLORS } from "../src/config/constants";

export default function CartScreen() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const clear = useCartStore((s) => s.clear);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <Stack.Screen options={{ title: "Panier" }} />

      <FlatList
        data={items}
        keyExtractor={(i) => i.menuItemId}
        ListEmptyComponent={
          <Text style={{ marginTop: 20, color: COLORS.muted }}>
            Votre panier est vide.
          </Text>
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              borderRadius: 14,
              backgroundColor: "#fafafa",
              borderWidth: 1,
              borderColor: "#eee",
            }}
          >
            <Text style={{ fontWeight: "900" }}>{item.name}</Text>
            <Text style={{ marginTop: 6, color: COLORS.muted }}>
              {item.unitPrice} MAD
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                marginTop: 10,
              }}
            >
              <Pressable
                onPress={() => decrement(item.menuItemId)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: "#f2f2f2",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "900" }}>−</Text>
              </Pressable>

              <Text style={{ fontSize: 16, fontWeight: "900" }}>
                {item.quantity}
              </Text>

              <Pressable
                onPress={() => increment(item.menuItemId)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: "#f2f2f2",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "900" }}>+</Text>
              </Pressable>

              <View style={{ flex: 1 }} />
              <Text style={{ fontWeight: "900" }}>
                {item.unitPrice * item.quantity} MAD
              </Text>
            </View>
          </View>
        )}
      />

      {items.length > 0 && (
        <>
          <View style={{ height: 16 }} />
          <Pressable onPress={clear}>
            <Text style={{ color: "#cc0000", fontWeight: "800" }}>
              Vider le panier
            </Text>
          </Pressable>

          <View style={{ flex: 1 }} />

          <Pressable
            onPress={() => router.push("/checkout")}
            style={{
              height: 56,
              borderRadius: 16,
              backgroundColor: COLORS.primary,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 14,
            }}
          >
            <Text style={{ fontWeight: "900", fontSize: 16 }}>
              Aller au paiement • {subtotal} MAD
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

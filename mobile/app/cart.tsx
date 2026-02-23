import React from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useCartStore } from "../src/stores/cartStore";
import { useAuthStore } from "../src/stores/authStore";
import { COLORS } from "../src/config/constants";

export default function CartScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const clear = useCartStore((s) => s.clear);

  const goToCheckout = () => {
    if (!isAuthenticated) {
      router.push({
        pathname: "/login",
        params: { redirect: "/checkout" },
      });
    } else {
      router.push("/checkout");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F7F7F7" }}>
      <Stack.Screen options={{ title: "Panier" }} />

      {items.length === 0 ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}
        >
          <Text style={{ fontSize: 52 }}>🛒</Text>
          <Text
            style={{
              marginTop: 16,
              fontSize: 20,
              fontWeight: "900",
              color: COLORS.text,
              textAlign: "center",
            }}
          >
            Votre panier est vide
          </Text>
          <Text
            style={{
              marginTop: 8,
              color: COLORS.muted,
              textAlign: "center",
              fontSize: 15,
            }}
          >
            Ajoutez des articles depuis un restaurant.
          </Text>
          <Pressable
            onPress={() => router.replace("/")}
            style={{
              marginTop: 24,
              height: 50,
              paddingHorizontal: 28,
              borderRadius: 14,
              backgroundColor: COLORS.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "900" }}>
              Explorer les restaurants
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(i) => i.menuItemId}
            contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            ListHeaderComponent={
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <Text
                  style={{ fontSize: 22, fontWeight: "900", color: COLORS.text }}
                >
                  Votre panier
                </Text>
                <Pressable onPress={clear}>
                  <Text style={{ color: "#EF4444", fontWeight: "700", fontSize: 13 }}>
                    Vider
                  </Text>
                </Pressable>
              </View>
            }
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 16,
                  padding: 14,
                  shadowColor: "#000",
                  shadowOpacity: 0.04,
                  shadowRadius: 6,
                  elevation: 2,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      fontWeight: "800",
                      fontSize: 15,
                      color: COLORS.text,
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text style={{ fontWeight: "900", color: COLORS.text }}>
                    {(item.unitPrice * item.quantity).toFixed(0)} MAD
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 0,
                  }}
                >
                  <Text style={{ color: COLORS.muted, fontSize: 13, flex: 1 }}>
                    {item.unitPrice} MAD / unité
                  </Text>

                  {/* Stepper */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#F2F2F2",
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                  >
                    <Pressable
                      onPress={() => decrement(item.menuItemId)}
                      style={{
                        width: 38,
                        height: 38,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "900",
                          color: COLORS.text,
                        }}
                      >
                        −
                      </Text>
                    </Pressable>

                    <Text
                      style={{
                        width: 30,
                        textAlign: "center",
                        fontWeight: "900",
                        fontSize: 16,
                        color: COLORS.text,
                      }}
                    >
                      {item.quantity}
                    </Text>

                    <Pressable
                      onPress={() => increment(item.menuItemId)}
                      style={{
                        width: 38,
                        height: 38,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "900",
                          color: COLORS.primary,
                        }}
                      >
                        +
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          />

          {/* Bottom CTA */}
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "white",
              paddingHorizontal: 16,
              paddingTop: 12,
              paddingBottom: 28,
              borderTopWidth: 1,
              borderColor: "#EEEEEE",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text style={{ color: COLORS.muted, fontWeight: "700" }}>
                Sous-total
              </Text>
              <Text style={{ fontWeight: "900", color: COLORS.text }}>
                {subtotal} MAD
              </Text>
            </View>

            <Pressable
              onPress={goToCheckout}
              style={({ pressed }) => ({
                height: 56,
                borderRadius: 16,
                backgroundColor: COLORS.primary,
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.85 : 1,
                shadowColor: COLORS.primary,
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              })}
            >
              <Text style={{ color: "white", fontWeight: "900", fontSize: 16 }}>
                Passer au paiement • {subtotal} MAD
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

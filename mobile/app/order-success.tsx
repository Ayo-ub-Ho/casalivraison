import React from "react";
import { View, Text, Pressable } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { COLORS } from "../src/config/constants";

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { orderId, total } = useLocalSearchParams<{
    orderId: string;
    total: string;
  }>();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Emoji / Icon */}
      <View
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: COLORS.primaryLight,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 30,
        }}
      >
        <Text style={{ fontSize: 50 }}>🎉</Text>
      </View>

      <Text
        style={{
          fontSize: 26,
          fontWeight: "900",
          textAlign: "center",
        }}
      >
        Commande confirmée !
      </Text>

      <Text
        style={{
          marginTop: 12,
          color: COLORS.muted,
          textAlign: "center",
          fontSize: 15,
        }}
      >
        Votre commande est en préparation.
      </Text>

      <Text
        style={{
          marginTop: 16,
          textAlign: "center",
          fontWeight: "900",
          fontSize: 18,
        }}
      >
        Total payé : {total} MAD
      </Text>

      <View style={{ height: 40 }} />

      {/* Suivre commande */}
      <Pressable
        onPress={() =>
          router.replace({
            pathname: "/order/[id]",
            params: { id: orderId },
          })
        }
        style={{
          height: 58,
          borderRadius: 18,
          backgroundColor: COLORS.primary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "900", fontSize: 16 }}>
          Suivre ma commande
        </Text>
      </Pressable>

      <View style={{ height: 14 }} />

      {/* Retour Home */}
      <Pressable
        onPress={() => router.replace("/")}
        style={{
          height: 58,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: COLORS.primary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontWeight: "900", color: COLORS.primary }}>
          Retour à l’accueil
        </Text>
      </Pressable>
    </View>
  );
}

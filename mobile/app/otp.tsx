import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api } from "../src/api/client";
import { useAuthStore } from "../src/stores/authStore";
import { COLORS } from "../src/config/constants";

export default function OtpScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [code, setCode] = useState("");

  const setAuth = useAuthStore((s) => s.setAuth);

  const verify = async () => {
    const res = await api.post("/api/auth/verify-otp", {
      phone,
      code,
    });

    await setAuth(res.data.user, res.data.token);

    router.replace("/");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: "900" }}>Code reçu</Text>

      <TextInput
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={4}
        style={{
          borderWidth: 1,
          borderColor: "#eee",
          padding: 14,
          borderRadius: 14,
          marginTop: 20,
          textAlign: "center",
          fontSize: 22,
          letterSpacing: 8,
        }}
      />

      <Pressable
        onPress={verify}
        style={{
          marginTop: 20,
          height: 55,
          borderRadius: 16,
          backgroundColor: COLORS.primary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "900" }}>Vérifier</Text>
      </Pressable>
    </View>
  );
}

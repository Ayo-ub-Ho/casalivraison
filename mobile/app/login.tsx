import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { api } from "../src/api/client";
import { COLORS } from "../src/config/constants";

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  const requestOtp = async () => {
    await api.post("/api/auth/request-otp", { phone });
    router.push({ pathname: "/otp", params: { phone } });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 26, fontWeight: "900" }}>Connexion</Text>

      <TextInput
        placeholder="06xxxxxxxx"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={{
          borderWidth: 1,
          borderColor: "#eee",
          padding: 14,
          borderRadius: 14,
          marginTop: 20,
        }}
      />

      <Pressable
        onPress={requestOtp}
        style={{
          marginTop: 20,
          height: 55,
          borderRadius: 16,
          backgroundColor: COLORS.primary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "900" }}>Envoyer code</Text>
      </Pressable>
    </View>
  );
}

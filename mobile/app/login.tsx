import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api } from "../src/api/client";
import { COLORS } from "../src/config/constants";

export default function LoginScreen() {
  const router = useRouter();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requestOtp = async () => {
    if (phone.length < 8) {
      setError("Numéro invalide. Entrez au moins 8 chiffres.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.post("/api/auth/request-otp", { phone });
      router.push({
        pathname: "/otp",
        params: { phone, redirect: redirect ?? "/" },
      });
    } catch (e: any) {
      setError(
        e?.response?.data?.message || "Impossible d'envoyer le code. Réessayez."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="dark-content" />

      {/* Orange accent top bar */}
      <View
        style={{
          height: 6,
          backgroundColor: COLORS.primary,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      />

      <View style={{ flex: 1, justifyContent: "center", padding: 28 }}>
        {/* Logo / Brand */}
        <View style={{ marginBottom: 40 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "700",
              color: COLORS.primary,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            CasaLivraison
          </Text>
          <Text
            style={{ fontSize: 30, fontWeight: "900", color: COLORS.text, lineHeight: 36 }}
          >
            Connexion
          </Text>
          <Text style={{ marginTop: 8, color: COLORS.muted, fontSize: 15 }}>
            Entrez votre numéro pour recevoir un code.
          </Text>
        </View>

        {/* Phone Input */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1.5,
            borderColor: error ? "#EF4444" : "#E5E5E5",
            borderRadius: 16,
            paddingHorizontal: 16,
            height: 58,
            backgroundColor: "#FAFAFA",
          }}
        >
          <Text style={{ fontSize: 16, marginRight: 10, color: COLORS.muted }}>
            🇲🇦
          </Text>
          <Text style={{ color: COLORS.muted, fontSize: 16, marginRight: 4 }}>
            +212
          </Text>
          <TextInput
            placeholder="6XXXXXXXX"
            placeholderTextColor="#BBB"
            value={phone}
            onChangeText={(t) => {
              setPhone(t);
              if (error) setError("");
            }}
            keyboardType="phone-pad"
            style={{
              flex: 1,
              fontSize: 18,
              fontWeight: "700",
              color: COLORS.text,
              letterSpacing: 1,
            }}
            maxLength={10}
          />
        </View>

        {!!error && (
          <Text style={{ marginTop: 8, color: "#EF4444", fontSize: 13 }}>
            {error}
          </Text>
        )}

        {/* CTA */}
        <Pressable
          onPress={requestOtp}
          disabled={loading}
          style={({ pressed }) => ({
            marginTop: 20,
            height: 58,
            borderRadius: 16,
            backgroundColor: COLORS.primary,
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed || loading ? 0.8 : 1,
            shadowColor: COLORS.primary,
            shadowOpacity: 0.35,
            shadowRadius: 10,
            elevation: 6,
          })}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: "white", fontWeight: "900", fontSize: 16 }}>
              Envoyer le code →
            </Text>
          )}
        </Pressable>

        <Text
          style={{ marginTop: 28, color: COLORS.muted, fontSize: 13, textAlign: "center" }}
        >
          En continuant, vous acceptez les conditions d'utilisation.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

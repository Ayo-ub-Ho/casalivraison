import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api } from "../src/api/client";
import { useAuthStore } from "../src/stores/authStore";
import { COLORS } from "../src/config/constants";

const OTP_LENGTH = 4;

export default function OtpScreen() {
  const router = useRouter();
  const { phone, redirect } = useLocalSearchParams<{
    phone: string;
    redirect?: string;
  }>();

  const setAuth = useAuthStore((s) => s.setAuth);

  const [digits, setDigits] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [error, setError] = useState("");

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const code = digits.join("");

  const handleDigit = (text: string, index: number) => {
    const digit = text.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (error) setError("");
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = "";
      setDigits(next);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verify = async () => {
    if (code.length < OTP_LENGTH) {
      setError("Entrez les 4 chiffres du code.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/auth/verify-otp", { phone, code });
      await setAuth(res.data.user, res.data.token);
      // Redirect to requested page (checkout) or home
      router.replace((redirect as any) ?? "/");
    } catch (e: any) {
      setError(e?.response?.data?.message || "Code incorrect. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (resendTimer > 0) return;
    try {
      await api.post("/api/auth/request-otp", { phone });
      setResendTimer(30);
      setDigits(["", "", "", ""]);
      setError("");
      Alert.alert("Code renvoyé", "Un nouveau code a été envoyé.");
    } catch {
      Alert.alert("Erreur", "Impossible de renvoyer le code.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        style={{
          height: 6,
          backgroundColor: COLORS.primary,
        }}
      />

      <View style={{ flex: 1, justifyContent: "center", padding: 28 }}>
        {/* Header */}
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
            style={{ fontSize: 28, fontWeight: "900", color: COLORS.text }}
          >
            Vérification
          </Text>
          <Text style={{ marginTop: 8, color: COLORS.muted, fontSize: 15 }}>
            Code envoyé au{" "}
            <Text style={{ fontWeight: "800", color: COLORS.text }}>
              +212 {phone}
            </Text>
          </Text>
        </View>

        {/* OTP Boxes */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 14,
            marginBottom: 8,
          }}
        >
          {digits.map((digit, i) => (
            <TextInput
              key={i}
              ref={(r) => {
                inputRefs.current[i] = r;
              }}
              value={digit}
              onChangeText={(t) => handleDigit(t, i)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, i)
              }
              keyboardType="number-pad"
              maxLength={2}
              style={{
                width: 62,
                height: 70,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: digit
                  ? COLORS.primary
                  : error
                    ? "#EF4444"
                    : "#E5E5E5",
                backgroundColor: digit ? COLORS.primaryLight : "#FAFAFA",
                textAlign: "center",
                fontSize: 28,
                fontWeight: "900",
                color: COLORS.text,
              }}
              autoFocus={i === 0}
              selectTextOnFocus
            />
          ))}
        </View>

        {!!error && (
          <Text
            style={{
              marginTop: 6,
              color: "#EF4444",
              fontSize: 13,
              textAlign: "center",
            }}
          >
            {error}
          </Text>
        )}

        {/* Verify CTA */}
        <Pressable
          onPress={verify}
          disabled={loading}
          style={({ pressed }) => ({
            marginTop: 28,
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
              Vérifier le code
            </Text>
          )}
        </Pressable>

        {/* Resend */}
        <Pressable
          onPress={resendCode}
          disabled={resendTimer > 0}
          style={{ marginTop: 20, alignItems: "center" }}
        >
          <Text
            style={{
              fontSize: 14,
              color: resendTimer > 0 ? COLORS.muted : COLORS.primary,
              fontWeight: "700",
            }}
          >
            {resendTimer > 0
              ? `Renvoyer le code dans ${resendTimer}s`
              : "Renvoyer le code"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

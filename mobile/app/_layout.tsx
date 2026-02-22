import { Stack } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../src/stores/authStore";
import { COLORS } from "../src/config/constants";

export default function RootLayout() {
  const restoreAuth = useAuthStore((state) => state.restore);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    restoreAuth();
  }, [restoreAuth]);

  if (loading) return null;
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: "#ffffff",
        headerTitleStyle: { fontWeight: "800" },
        contentStyle: { backgroundColor: "#fff" },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="orders" />
      <Stack.Screen name="order/[id]" />
      <Stack.Screen name="cart" />
      <Stack.Screen name="login" options={{ title: "Se connecter" }} />
      <Stack.Screen name="order-success" options={{ headerShown: false }} />
    </Stack>
  );
}

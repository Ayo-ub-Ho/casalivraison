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
      <Stack.Screen name="login" options={{ title: "Se Connecter" }} />
      <Stack.Screen name="otp" options={{ title: "Vérification" }} />
      <Stack.Screen name="cart" options={{ title: "Panier" }} />
      <Stack.Screen name="checkout" options={{ title: "Paiement" }} />
      <Stack.Screen name="orders" options={{ title: "Mes commandes" }} />
      <Stack.Screen name="order/[id]" options={{ title: "Commande" }} />
      <Stack.Screen name="order-success" options={{ headerShown: false }} />
      <Stack.Screen name="address/pick" options={{ title: "Adresse" }} />
      <Stack.Screen name="menu-item/[id]" options={{ title: "Article" }} />
      <Stack.Screen name="restaurant/[id]" options={{ title: "Restaurant" }} />
    </Stack>
  );
}

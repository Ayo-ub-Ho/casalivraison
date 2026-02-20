import { Stack } from "expo-router";
import { COLORS } from "../src/config/constants";

export default function RootLayout() {
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
    </Stack>
  );
}

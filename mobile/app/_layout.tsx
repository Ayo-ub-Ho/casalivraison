import { Stack } from "expo-router";
import { COLORS } from "../src/config/constants";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: "#111",
        headerTitleStyle: { fontWeight: "800" },
        contentStyle: { backgroundColor: "#fff" },
        headerShown: false,
      }}
    />
  );
}

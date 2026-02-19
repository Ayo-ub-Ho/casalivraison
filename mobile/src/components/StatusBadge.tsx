import React from "react";
import { View, Text } from "react-native";
import { COLORS } from "../config/constants";

export default function StatusBadge({ status }: { status: string }) {
  let bg = "#eee";
  let color = "#000";

  if (status === "PENDING") {
    bg = COLORS.primaryLight;
    color = COLORS.primary;
  }

  if (status === "CONFIRMED") {
    bg = "#FEF3C7";
    color = COLORS.warning;
  }

  if (status === "DELIVERED") {
    bg = "#DCFCE7";
    color = COLORS.success;
  }

  return (
    <View
      style={{
        backgroundColor: bg,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ fontWeight: "800", color }}>{status}</Text>
    </View>
  );
}

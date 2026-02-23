import React from "react";
import { View, Text } from "react-native";
import { COLORS } from "../config/constants";

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  PREPARING: "En préparation",
  OUT_FOR_DELIVERY: "En livraison",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

export const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: COLORS.primaryLight, text: COLORS.primary },
  CONFIRMED: { bg: "#FEF3C7", text: COLORS.warning },
  PREPARING: { bg: "#FEF3C7", text: COLORS.warning },
  OUT_FOR_DELIVERY: { bg: "#DBEAFE", text: "#2563EB" },
  DELIVERED: { bg: "#DCFCE7", text: COLORS.success },
  CANCELLED: { bg: "#FEE2E2", text: "#DC2626" },
};

export default function StatusBadge({ status }: { status: string }) {
  const colors = STATUS_COLORS[status] ?? { bg: "#EEE", text: "#555" };
  const label = STATUS_LABELS[status] ?? status;

  return (
    <View
      style={{
        backgroundColor: colors.bg,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 999,
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ fontWeight: "800", fontSize: 13, color: colors.text }}>
        {label}
      </Text>
    </View>
  );
}

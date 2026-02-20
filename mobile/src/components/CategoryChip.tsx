import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { COLORS } from "../config/constants";

export default function CategoryChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 999,
        marginRight: 10,
        backgroundColor: active ? COLORS.primary : "white",
        borderWidth: 1,
        borderColor: active ? COLORS.primary : "#eee",
      }}
    >
      <Text
        style={{
          fontWeight: "800",
          color: active ? "white" : "#333",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

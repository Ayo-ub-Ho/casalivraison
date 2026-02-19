import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "../config/constants";

export default function RestaurantCard({ restaurant }: any) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/restaurant/${restaurant.id}`)}
      style={{
        backgroundColor: "white",
        borderRadius: 20,
        marginBottom: 18,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      {/* IMAGE */}
      <Image
        source={{ uri: restaurant.imageUrl }}
        style={{
          height: 160,
          width: "100%",
        }}
      />

      {/* CONTENT */}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "900" }}>
          {restaurant.name}
        </Text>

        <Text style={{ marginTop: 6, color: COLORS.muted }}>
          {restaurant.category} • {restaurant.prepTimeMin} min
        </Text>

        {/* STATUS */}
        <View
          style={{
            marginTop: 10,
            backgroundColor: restaurant.isOpen ? "#DCFCE7" : "#FEE2E2",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 999,
            alignSelf: "flex-start",
          }}
        >
          <Text
            style={{
              fontWeight: "800",
              color: restaurant.isOpen ? "#16A34A" : "#DC2626",
            }}
          >
            {restaurant.isOpen ? "Ouvert" : "Fermé"}
          </Text>
        </View>

        {/* PROGRESS BAR DONE STYLE */}
        <View
          style={{
            height: 4,
            backgroundColor: "#eee",
            borderRadius: 4,
            marginTop: 14,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: "35%",
              height: "100%",
              backgroundColor: COLORS.primary,
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

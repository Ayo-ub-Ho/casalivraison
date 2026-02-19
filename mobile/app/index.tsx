import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import RestaurantCard from "../src/components/RestaurantCard";
import { api } from "../src/api/client";
import { COLORS } from "../src/config/constants";

type Restaurant = {
  id: string;
  name: string;
  category: string;
  isOpen: boolean;
  prepTimeMin: number;
};

export default function HomeScreen() {
  const [data, setData] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Restaurant[]>("/api/restaurants")
      .then((res) => setData(res.data))
      .catch((e) => console.log("API error:", e?.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F7F7F7" }}>
      {/* HEADER */}
      <View
        style={{
          backgroundColor: COLORS.primary,
          paddingTop: 60,
          paddingHorizontal: 20,
          paddingBottom: 30,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <Text style={{ color: "white", fontSize: 26, fontWeight: "900" }}>
          CasaLivraison
        </Text>

        <Text style={{ color: "white", marginTop: 6 }}>
          Casablanca • Gauthier
        </Text>
      </View>

      {/* LIST */}
      <FlatList
        contentContainerStyle={{
          padding: 16,
          paddingTop: 20,
          paddingBottom: 120,
        }}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RestaurantCard restaurant={item} />}
      />
    </View>
  );
}

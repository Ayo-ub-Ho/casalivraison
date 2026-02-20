import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import RestaurantCard from "../src/components/RestaurantCard";
import { api } from "../src/api/client";
import { COLORS } from "../src/config/constants";
import CategoryChip from "../src/components/CategoryChip";
import CartBar from "../src/components/CartBar";

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

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  const categories = Array.from(new Set(data.map((r) => r.category)));

  const filteredData = selectedCategory
    ? data.filter((r) => r.category === selectedCategory)
    : data;

  return (
    <View style={{ flex: 1, backgroundColor: "#F7F7F7", position: "relative" }}>
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

      {/* CATEGORIES */}
      <View style={{ marginTop: 16 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          data={["Tous", ...categories]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <CategoryChip
              label={item}
              active={
                (item === "Tous" && !selectedCategory) ||
                selectedCategory === item
              }
              onPress={() =>
                item === "Tous"
                  ? setSelectedCategory(null)
                  : setSelectedCategory(item)
              }
            />
          )}
        />
      </View>

      {/* RESTAURANTS */}
      <FlatList
        contentContainerStyle={{
          padding: 16,
          paddingTop: 20,
          paddingBottom: 120, // important pour laisser place au CartBar
        }}
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RestaurantCard restaurant={item} />}
      />

      {/* 🔥 Sticky Cart */}
      <CartBar />
    </View>
  );
}

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
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
  const router = useRouter();
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
    <View style={{ flex: 1, padding: 16, backgroundColor: COLORS.bg }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/restaurant/[id]",
                params: { id: item.id, name: item.name },
              })
            }
            style={{
              padding: 14,
              borderRadius: 14,
              backgroundColor: COLORS.card,
              borderWidth: 1,
              borderColor: "#eee",
            }}
          >
            <Text
              style={{ fontSize: 16, fontWeight: "800", color: COLORS.text }}
            >
              {item.name}
            </Text>
            <Text style={{ marginTop: 4, color: COLORS.muted }}>
              {item.category} • {item.prepTimeMin} min •{" "}
              {item.isOpen ? "Ouvert" : "Fermé"}
            </Text>
            <View
              style={{
                marginTop: 10,
                height: 4,
                width: 90,
                backgroundColor: COLORS.primary,
                borderRadius: 999,
              }}
            />
          </Pressable>
        )}
      />
    </View>
  );
}

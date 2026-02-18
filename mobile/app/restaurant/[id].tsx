import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { api } from "../../src/api/client";
import { COLORS } from "../../src/config/constants";
import CartBar from "../../src/components/CartBar";

type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
};
type Category = { id: string; name: string; MenuItems: MenuItem[] };

export default function RestaurantScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    api
      .get(`/api/restaurants/${id}/menu`)
      .then((res) => setCategories(res.data.categories || []))
      .catch((e) => console.log("API error:", e?.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.bg,
        position: "relative",
        paddingBottom: 90,
      }}
    >
      <Stack.Screen options={{ title: name ?? "Restaurant" }} />

      {loading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator />
          <Text style={{ marginTop: 8 }}>Chargement du menu...</Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(c) => c.id}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          renderItem={({ item: cat }) => (
            <View>
              <Text
                style={{ fontSize: 18, fontWeight: "900", color: COLORS.text }}
              >
                {cat.name}
              </Text>

              <View style={{ height: 8 }} />

              {cat.MenuItems.map((mi) => (
                <Pressable
                  key={mi.id}
                  onPress={() =>
                    router.push({
                      pathname: "/menu-item/[id]",
                      params: { id: mi.id },
                    })
                  }
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: "#fafafa",
                    borderWidth: 1,
                    borderColor: "#eee",
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontWeight: "800", color: COLORS.text }}>
                    {mi.name}
                  </Text>
                  {!!mi.description && (
                    <Text style={{ marginTop: 4, color: COLORS.muted }}>
                      {mi.description}
                    </Text>
                  )}
                  <Text style={{ marginTop: 6, fontWeight: "900" }}>
                    {mi.price} MAD
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        />
      )}

      <CartBar />
    </View>
  );
}

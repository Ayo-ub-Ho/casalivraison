import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { api } from "../src/api/client";
import { COLORS } from "../src/config/constants";

type Order = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  Restaurant: { name: string };
};

export default function OrdersScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();

  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!phone) return;

    api
      .get(`/api/orders?phone=${phone}`)
      .then((res) => setData(res.data))
      .catch((e) => console.log(e?.message))
      .finally(() => setLoading(false));
  }, [phone]);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <Stack.Screen options={{ title: "Mes commandes" }} />

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/order/[id]",
                  params: { id: item.id },
                })
              }
              style={{
                padding: 14,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: "#eee",
                backgroundColor: "#fafafa",
              }}
            >
              <Text style={{ fontWeight: "900" }}>{item.Restaurant?.name}</Text>

              <Text style={{ marginTop: 4, color: COLORS.muted }}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>

              <Text style={{ marginTop: 6, fontWeight: "900" }}>
                {item.total} MAD
              </Text>

              <Text
                style={{
                  marginTop: 6,
                  fontWeight: "900",
                  color:
                    item.status === "DELIVERED"
                      ? "green"
                      : item.status === "CONFIRMED"
                        ? "orange"
                        : "black",
                }}
              >
                {item.status}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

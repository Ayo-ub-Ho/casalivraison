import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { api } from "../src/api/client";
import { COLORS } from "../src/config/constants";
import { useAuthStore } from "../src/stores/authStore";
import StatusBadge from "../src/components/StatusBadge";

type Order = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  Restaurant: { name: string };
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-MA", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrdersScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async (isRefresh = false) => {
    if (!user?.phone) {
      setLoading(false);
      return;
    }
    if (isRefresh) setRefreshing(true);
    try {
      const res = await api.get(`/api/orders?phone=${user.phone}`);
      setData(res.data);
    } catch (e: any) {
      console.log("Orders fetch error:", e?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.phone]);

  return (
    <View style={{ flex: 1, backgroundColor: "#F7F7F7" }}>
      <Stack.Screen options={{ title: "Mes commandes" }} />

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchOrders(true)}
              tintColor={COLORS.primary}
            />
          }
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 80,
              }}
            >
              <Text style={{ fontSize: 52 }}>📋</Text>
              <Text
                style={{
                  marginTop: 16,
                  fontSize: 20,
                  fontWeight: "900",
                  color: COLORS.text,
                  textAlign: "center",
                }}
              >
                Aucune commande
              </Text>
              <Text
                style={{
                  marginTop: 8,
                  color: COLORS.muted,
                  textAlign: "center",
                  fontSize: 15,
                }}
              >
                Vos commandes passées apparaîtront ici.
              </Text>
              <Pressable
                onPress={() => router.replace("/")}
                style={{
                  marginTop: 24,
                  height: 50,
                  paddingHorizontal: 28,
                  borderRadius: 14,
                  backgroundColor: COLORS.primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "white", fontWeight: "900" }}>
                  Commander maintenant
                </Text>
              </Pressable>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/order/[id]",
                  params: { id: item.id },
                })
              }
              style={({ pressed }) => ({
                backgroundColor: "white",
                borderRadius: 18,
                padding: 16,
                opacity: pressed ? 0.88 : 1,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              })}
            >
              {/* Restaurant + Date */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "900",
                    color: COLORS.text,
                    flex: 1,
                    marginRight: 8,
                  }}
                >
                  {item.Restaurant?.name ?? "Restaurant"}
                </Text>
                <Text style={{ color: COLORS.muted, fontSize: 12 }}>
                  {formatDate(item.createdAt)}
                </Text>
              </View>

              {/* Status + Total */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <StatusBadge status={item.status} />
                <Text style={{ fontWeight: "900", fontSize: 16, color: COLORS.text }}>
                  {item.total} MAD
                </Text>
              </View>

              {/* Tap hint */}
              <Text
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  color: COLORS.muted,
                  fontWeight: "600",
                }}
              >
                Voir le détail →
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

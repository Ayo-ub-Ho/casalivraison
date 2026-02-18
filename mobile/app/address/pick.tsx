import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import { COLORS } from "../../src/config/constants";
import { useCheckoutStore } from "../../src/stores/checkoutStore";

type Center = { latitude: number; longitude: number };

export default function PickAddressScreen() {
  const router = useRouter();
  const setDropoff = useCheckoutStore((s) => s.setDropoff);

  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [center, setCenter] = useState<Center | null>(null);

  const region = useMemo(() => {
    if (!center) return null;
    return {
      latitude: center.latitude,
      longitude: center.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }, [center]);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setPermissionDenied(true);
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setCenter({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      setLoading(false);
    })();
  }, []);

  const onUsePoint = async () => {
    if (!center) return;

    // Reverse geocoding (best effort)
    let text = "Point sélectionné";
    try {
      const res = await Location.reverseGeocodeAsync(center);
      if (res?.[0]) {
        const a = res[0];
        text = [a.name, a.street, a.city].filter(Boolean).join(", ");
      }
    } catch {}

    setDropoff(center, text);
    router.back();
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Chargement de la carte...</Text>
      </View>
    );
  }

  if (permissionDenied) {
    return (
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "900", marginBottom: 10 }}>
          GPS désactivé
        </Text>
        <Text style={{ color: COLORS.muted, marginBottom: 16 }}>
          Activez le GPS pour vous localiser sur la carte.
        </Text>

        <Pressable
          onPress={() =>
            Alert.alert("Info", "Active le GPS + relance l’écran.")
          }
          style={{
            height: 54,
            borderRadius: 16,
            backgroundColor: COLORS.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontWeight: "900" }}>Activer</Text>
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          style={{ marginTop: 14, alignItems: "center" }}
        >
          <Text style={{ fontWeight: "800" }}>Pas maintenant</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen options={{ title: "Adresse" }} />

      {region && (
        <MapView
          style={{ flex: 1 }}
          initialRegion={region}
          onRegionChangeComplete={(r) =>
            setCenter({ latitude: r.latitude, longitude: r.longitude })
          }
        />
      )}

      {/* PIN center (simple) */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          marginTop: -24,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: "#000",
          }}
        />
        <View style={{ width: 2, height: 26, backgroundColor: "#000" }} />
      </View>

      {/* Bottom sheet */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#fff",
          padding: 16,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          borderTopWidth: 1,
          borderColor: "#eee",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "900", marginBottom: 10 }}>
          Où devons-nous livrer ?
        </Text>

        <Pressable
          onPress={onUsePoint}
          style={{
            height: 54,
            borderRadius: 16,
            backgroundColor: COLORS.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontWeight: "900" }}>Utiliser ce point</Text>
        </Pressable>
      </View>
    </View>
  );
}

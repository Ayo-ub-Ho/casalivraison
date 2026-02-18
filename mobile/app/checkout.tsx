import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { COLORS } from "../src/config/constants";
import { useCartStore } from "../src/stores/cartStore";
import { useCheckoutStore } from "../src/stores/checkoutStore";
import { api } from "../src/api/client";

export default function CheckoutScreen() {
  const router = useRouter();

  const cartItems = useCartStore((s) => s.items);
  const restaurantId = useCartStore((s) => s.restaurantId);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clear);

  const phone = useCheckoutStore((s) => s.phone);
  const notes = useCheckoutStore((s) => s.notes);
  const deliveryFee = useCheckoutStore((s) => s.deliveryFee);
  const dropoffText = useCheckoutStore((s) => s.dropoffAddressText);
  const dropoffLocation = useCheckoutStore((s) => s.dropoffLocation);
  const setPhone = useCheckoutStore((s) => s.setPhone);
  const setNotes = useCheckoutStore((s) => s.setNotes);

  const total = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!cartItems.length) return;

    if (!dropoffLocation) {
      Alert.alert("Adresse", "Veuillez choisir l’adresse sur la carte.");
      router.push("/address/pick");
      return;
    }

    if (!phone || phone.length < 8) {
      Alert.alert("Téléphone", "Veuillez saisir votre numéro de téléphone.");
      return;
    }

    if (!restaurantId) {
      Alert.alert("Erreur", "Restaurant manquant.");
      return;
    }

    setSubmitting(true);

    try {
      // ⚠️ MVP: userId (backend) — si ton endpoint crée un user par phone, parfait
      // sinon tu peux passer userId fixe temporaire (mais الأفضل: backend create/find user by phone)
      const payload = {
        phone,
        restaurantId,
        notes: notes || undefined,
        items: cartItems.map((x) => ({
          menuItemId: x.menuItemId,
          quantity: x.quantity,
        })),
        dropoffLocation: {
          type: "Point",
          coordinates: [dropoffLocation.longitude, dropoffLocation.latitude],
        },
        dropoffAddressText: dropoffText || "Adresse sélectionnée",
        deliveryFee,
      };

      const res = await api.post("/api/orders", payload);
      clearCart();

      Alert.alert("Commande", "Commande créée ✅", [
        {
          text: "OK",
          onPress: () =>
            router.replace({ pathname: "/orders", params: { phone } }),
        },
      ]);
      console.log(res.data);
    } catch (e: any) {
      Alert.alert(
        "Erreur",
        e?.response?.data?.message || "Impossible de créer la commande",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen options={{ title: "Paiement" }} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* Votre commande */}
        <Text style={{ fontSize: 22, fontWeight: "900" }}>Votre commande</Text>

        <View style={{ marginTop: 12, gap: 10 }}>
          {cartItems.map((x) => (
            <View
              key={x.menuItemId}
              style={{
                padding: 12,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: "#eee",
                backgroundColor: "#fafafa",
              }}
            >
              <Text style={{ fontWeight: "900" }}>{x.name}</Text>
              <Text style={{ color: COLORS.muted, marginTop: 4 }}>
                {x.quantity} × {x.unitPrice} MAD
              </Text>
            </View>
          ))}
        </View>

        {/* Instructions */}
        <View
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: "#eee",
          }}
        >
          <Text style={{ fontWeight: "900", marginBottom: 8 }}>
            Des instructions ?
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Ex: Sans oignon svp..."
            style={{ paddingVertical: 8 }}
          />
        </View>

        {/* Détails livraison */}
        <Text style={{ marginTop: 18, fontSize: 18, fontWeight: "900" }}>
          Détails de livraison
        </Text>

        <Pressable
          onPress={() => router.push("/address/pick")}
          style={{
            marginTop: 10,
            padding: 12,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: "#eee",
            backgroundColor: "#fafafa",
          }}
        >
          <Text style={{ fontWeight: "900" }}>Adresse</Text>
          <Text style={{ marginTop: 6, color: COLORS.muted }}>
            {dropoffLocation ? dropoffText : "Choisir sur la carte"}
          </Text>
          <Text style={{ marginTop: 6, fontWeight: "800", color: "#444" }}>
            Changer →
          </Text>
        </Pressable>

        {/* Téléphone */}
        <View
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: "#eee",
          }}
        >
          <Text style={{ fontWeight: "900", marginBottom: 8 }}>Téléphone</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="06xxxxxxxx"
            keyboardType="phone-pad"
            style={{ paddingVertical: 8 }}
          />
        </View>

        {/* Récap */}
        <Text style={{ marginTop: 18, fontSize: 18, fontWeight: "900" }}>
          Récapitulatif
        </Text>

        <View style={{ marginTop: 10, gap: 8 }}>
          <Row label="Produits" value={`${subtotal} MAD`} />
          <Row label="Livraison" value={`${deliveryFee} MAD`} />
          <View
            style={{ height: 1, backgroundColor: "#eee", marginVertical: 6 }}
          />
          <Row label="Total" value={`${total} MAD`} bold />
        </View>
      </ScrollView>

      {/* CTA sticky */}
      <View
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 16,
        }}
      >
        <Pressable
          disabled={submitting}
          onPress={onSubmit}
          style={{
            height: 56,
            borderRadius: 16,
            backgroundColor: COLORS.primary,
            alignItems: "center",
            justifyContent: "center",
            opacity: submitting ? 0.7 : 1,
          }}
        >
          <Text style={{ fontWeight: "900", fontSize: 16 }}>
            {submitting ? "Envoi..." : `Passer la commande • ${total} MAD`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={{ color: "#333", fontWeight: bold ? "900" : "700" }}>
        {label}
      </Text>
      <Text style={{ fontWeight: bold ? "900" : "700" }}>{value}</Text>
    </View>
  );
}

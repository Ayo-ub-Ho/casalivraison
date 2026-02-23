import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useAuthStore } from "../src/stores/authStore";
import { COLORS } from "../src/config/constants";
import { useCartStore } from "../src/stores/cartStore";
import { useCheckoutStore } from "../src/stores/checkoutStore";
import { api } from "../src/api/client";

export default function CheckoutScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  const cartItems = useCartStore((s) => s.items);
  const restaurantId = useCartStore((s) => s.restaurantId);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clear);

  const notes = useCheckoutStore((s) => s.notes);
  const deliveryFee = useCheckoutStore((s) => s.deliveryFee);
  const dropoffText = useCheckoutStore((s) => s.dropoffAddressText);
  const dropoffLocation = useCheckoutStore((s) => s.dropoffLocation);
  const setNotes = useCheckoutStore((s) => s.setNotes);

  const total = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);
  const [submitting, setSubmitting] = useState(false);

  // Safety net: if somehow user lands here unauthenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace({
        pathname: "/login",
        params: { redirect: "/checkout" },
      });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const onSubmit = async () => {
    if (!cartItems.length) return;

    if (!dropoffLocation) {
      Alert.alert("Adresse manquante", "Veuillez choisir une adresse de livraison.", [
        { text: "Choisir", onPress: () => router.push("/address/pick") },
        { text: "Annuler", style: "cancel" },
      ]);
      return;
    }

    if (!restaurantId) {
      Alert.alert("Erreur", "Restaurant introuvable.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        phone: user!.phone,
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

      router.replace({
        pathname: "/order-success",
        params: { orderId: res.data.id, total: res.data.total },
      });
    } catch (e: any) {
      Alert.alert(
        "Erreur",
        e?.response?.data?.message || "Impossible de créer la commande"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F7F7F7" }}>
      <Stack.Screen options={{ title: "Paiement" }} />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Section: Commande ─── */}
        <SectionHeader icon="🛍️" title="Votre commande" />
        <View style={styles.card}>
          {cartItems.map((x, i) => (
            <View key={x.menuItemId}>
              {i > 0 && <View style={styles.divider} />}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 8,
                }}
              >
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={{ fontWeight: "800", color: COLORS.text }}>
                    {x.name}
                  </Text>
                  <Text style={{ color: COLORS.muted, fontSize: 13, marginTop: 2 }}>
                    {x.quantity} × {x.unitPrice} MAD
                  </Text>
                </View>
                <Text style={{ fontWeight: "900", color: COLORS.text }}>
                  {(x.unitPrice * x.quantity).toFixed(0)} MAD
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ─── Section: Livraison ─── */}
        <SectionHeader icon="📍" title="Livraison" />

        {/* Address picker */}
        <Pressable
          onPress={() => router.push("/address/pick")}
          style={({ pressed }) => [styles.card, { opacity: pressed ? 0.85 : 1 }]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, color: COLORS.muted, marginBottom: 4 }}>
                Adresse de livraison
              </Text>
              <Text
                style={{
                  fontWeight: "700",
                  color: dropoffLocation ? COLORS.text : COLORS.muted,
                  fontSize: 15,
                }}
                numberOfLines={2}
              >
                {dropoffLocation
                  ? dropoffText || "Point sélectionné"
                  : "Choisir sur la carte"}
              </Text>
            </View>
            <Text
              style={{
                color: COLORS.primary,
                fontWeight: "800",
                marginLeft: 12,
                marginTop: 16,
              }}
            >
              {dropoffLocation ? "Changer →" : "Choisir →"}
            </Text>
          </View>
        </Pressable>

        {/* Phone (read-only) */}
        <View style={[styles.card, { marginTop: 10 }]}>
          <Text style={{ fontSize: 13, color: COLORS.muted, marginBottom: 4 }}>
            Téléphone de contact
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "800", color: COLORS.text }}>
            +212 {user?.phone}
          </Text>
        </View>

        {/* Notes */}
        <View style={[styles.card, { marginTop: 10 }]}>
          <Text style={{ fontSize: 13, color: COLORS.muted, marginBottom: 6 }}>
            Instructions (optionnel)
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Ex: Sans oignon, sonnez à l'entrée..."
            placeholderTextColor="#BBB"
            multiline
            style={{
              fontSize: 15,
              color: COLORS.text,
              minHeight: 48,
              lineHeight: 22,
            }}
          />
        </View>

        {/* ─── Section: Récapitulatif ─── */}
        <SectionHeader icon="💳" title="Récapitulatif" />
        <View style={styles.card}>
          <SummaryRow label="Sous-total" value={`${subtotal} MAD`} />
          <SummaryRow label="Frais de livraison" value={`${deliveryFee} MAD`} />
          <View style={[styles.divider, { marginVertical: 10 }]} />
          <SummaryRow
            label="Total"
            value={`${total} MAD`}
            bold
            highlight
          />
        </View>
      </ScrollView>

      {/* ─── Sticky CTA ─── */}
      <View
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 24,
        }}
      >
        <Pressable
          disabled={submitting}
          onPress={onSubmit}
          style={({ pressed }) => ({
            height: 58,
            borderRadius: 18,
            backgroundColor: COLORS.primary,
            alignItems: "center",
            justifyContent: "center",
            opacity: submitting || pressed ? 0.8 : 1,
            shadowColor: COLORS.primary,
            shadowOpacity: 0.35,
            shadowRadius: 12,
            elevation: 7,
          })}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ fontWeight: "900", fontSize: 16, color: "white" }}>
              Confirmer la commande • {total} MAD
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

// ─── Sub-components ───────────────────────────────────────────

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 20,
        marginBottom: 8,
      }}
    >
      <Text style={{ fontSize: 16 }}>{icon}</Text>
      <Text style={{ fontSize: 17, fontWeight: "900", color: COLORS.text }}>
        {title}
      </Text>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  bold,
  highlight,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
      }}
    >
      <Text
        style={{
          color: highlight ? COLORS.text : COLORS.muted,
          fontWeight: bold ? "900" : "600",
          fontSize: bold ? 16 : 14,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontWeight: bold ? "900" : "700",
          color: highlight ? COLORS.primary : COLORS.text,
          fontSize: bold ? 16 : 14,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = {
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
};

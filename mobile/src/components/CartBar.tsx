import React, { useEffect, useRef } from "react";
import { Text, Pressable, Animated, Easing } from "react-native";
import { useRouter } from "expo-router";
import { useCartStore } from "../stores/cartStore";
import { COLORS } from "../config/constants";

export default function CartBar() {
  const router = useRouter();
  const count = useCartStore((s) => s.count());
  const subtotal = useCartStore((s) => s.subtotal());

  const translateY = useRef(new Animated.Value(100)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (count > 0) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 100,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [count]);

  if (count === 0) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 16,
        transform: [{ translateY }],
      }}
    >
      <Pressable
        onPressIn={() => {
          Animated.spring(scale, {
            toValue: 0.97,
            useNativeDriver: true,
          }).start();
        }}
        onPressOut={() => {
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
        }}
        onPress={() => router.push("/cart")}
      >
        <Animated.View
          style={{
            transform: [{ scale }],
            height: 58,
            borderRadius: 18,
            backgroundColor: COLORS.primary,
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          <Text style={{ fontWeight: "900", fontSize: 16, color: "white" }}>
            🛒 {count} article{count > 1 ? "s" : ""}
          </Text>

          <Text style={{ fontWeight: "900", fontSize: 16, color: "white" }}>
            {subtotal} MAD →
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

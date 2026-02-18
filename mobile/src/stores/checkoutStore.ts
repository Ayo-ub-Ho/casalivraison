import { create } from "zustand";

type GeoPoint = { latitude: number; longitude: number };

type DeliveryOption = "DELIVERY";

type CheckoutState = {
  phone: string;
  notes: string;

  dropoffLocation: GeoPoint | null;
  dropoffAddressText: string;

  deliveryOption: DeliveryOption;
  deliveryFee: number;

  setPhone: (phone: string) => void;
  setNotes: (notes: string) => void;

  setDropoff: (p: GeoPoint, text: string) => void;
  setDeliveryOption: (opt: DeliveryOption) => void;
  setDeliveryFee: (fee: number) => void;

  reset: () => void;
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
  phone: "",
  notes: "",

  dropoffLocation: null,
  dropoffAddressText: "",

  deliveryOption: "DELIVERY",
  deliveryFee: 15, // MVP (later: calc)

  setPhone: (phone) => set({ phone }),
  setNotes: (notes) => set({ notes }),

  setDropoff: (p, text) => set({ dropoffLocation: p, dropoffAddressText: text }),
  setDeliveryOption: (deliveryOption) => set({ deliveryOption }),
  setDeliveryFee: (deliveryFee) => set({ deliveryFee }),

  reset: () =>
    set({
      phone: "",
      notes: "",
      dropoffLocation: null,
      dropoffAddressText: "",
      deliveryOption: "DELIVERY",
      deliveryFee: 15,
    }),
}));

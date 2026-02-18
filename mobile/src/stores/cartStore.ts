import { create } from "zustand";

export type CartItem = {
  menuItemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  restaurantId: string;
};

type CartState = {
  restaurantId: string | null;
  items: CartItem[];

  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  increment: (menuItemId: string) => void;
  decrement: (menuItemId: string) => void;
  removeItem: (menuItemId: string) => void;

  clear: () => void;

  subtotal: () => number;
  count: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  restaurantId: null,
  items: [],

  addItem: (item, qty = 1) => {
    const state = get();

    if (state.restaurantId && state.restaurantId !== item.restaurantId) {
      set({ restaurantId: item.restaurantId, items: [{ ...item, quantity: qty }] });
      return;
    }

    const existing = state.items.find((x) => x.menuItemId === item.menuItemId);
    if (existing) {
      set({
        restaurantId: item.restaurantId,
        items: state.items.map((x) =>
          x.menuItemId === item.menuItemId
            ? { ...x, quantity: x.quantity + qty }
            : x
        ),
      });
      return;
    }

    set({
      restaurantId: item.restaurantId,
      items: [...state.items, { ...item, quantity: qty }],
    });
  },

  increment: (menuItemId) => {
    const state = get();
    set({
      items: state.items.map((x) =>
        x.menuItemId === menuItemId ? { ...x, quantity: x.quantity + 1 } : x
      ),
    });
  },

  decrement: (menuItemId) => {
    const state = get();
    const next = state.items
      .map((x) =>
        x.menuItemId === menuItemId ? { ...x, quantity: x.quantity - 1 } : x
      )
      .filter((x) => x.quantity > 0);

    set({ items: next, restaurantId: next.length ? state.restaurantId : null });
  },

  removeItem: (menuItemId) => {
    const state = get();
    const next = state.items.filter((x) => x.menuItemId !== menuItemId);
    set({ items: next, restaurantId: next.length ? state.restaurantId : null });
  },

  clear: () => set({ items: [], restaurantId: null }),

  subtotal: () => get().items.reduce((sum, x) => sum + x.unitPrice * x.quantity, 0),
  count: () => get().items.reduce((sum, x) => sum + x.quantity, 0),
}));

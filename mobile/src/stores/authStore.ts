import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  id: string;
  phone: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;

  setAuth: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  restore: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: true,
  isAuthenticated: false,

  setAuth: async (user, token) => {
    await AsyncStorage.setItem("auth_token", token);
    await AsyncStorage.setItem("auth_user", JSON.stringify(user));

    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    await AsyncStorage.removeItem("auth_token");
    await AsyncStorage.removeItem("auth_user");
    set({ user: null, token: null, isAuthenticated: false });
  },

  restore: async () => {
  try {
    const token = await AsyncStorage.getItem("auth_token");
    const user = await AsyncStorage.getItem("auth_user");

    if (token && user) {
      set({
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
      });
    }
  } catch (error) {
    console.log("Restore error:", error);
  } finally {
    set({ loading: false });
  }
},
}));
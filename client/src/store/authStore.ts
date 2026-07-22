import { create } from "zustand";

export type User = {
  id: string;
  accountNumber: string;
  username: string;
};

export type Auth = {
  user: User | null;
  accessToken: string;
};

type AuthStore = {
  auth: Auth;
  persist: boolean;

  setAuth: (auth: Auth) => void;
  updateAuth: (updates: Partial<Auth>) => void;
  setPersist: (persist: boolean) => void;
  logout: () => void;
};

const initialAuth: Auth = {
  user: null,
  accessToken: "",
};

export const useAuthStore = create<AuthStore>((set) => ({
  auth: initialAuth,
  persist: JSON.parse(localStorage.getItem("persist") ?? "false"),

  setAuth: (auth) => set({ auth }),

  updateAuth: (updates) =>
    set((state) => ({
      auth: {
        ...state.auth,
        ...updates,
      },
    })),

  setPersist: (persist) => {
    localStorage.setItem("persist", JSON.stringify(persist));
    set({ persist });
  },

  logout: () => set({ auth: initialAuth }),
}));

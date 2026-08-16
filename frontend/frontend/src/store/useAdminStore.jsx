import { create } from "zustand";
import axios from "axios";
import { BASE_URL } from "./useProductStore";

const STORAGE_KEY = "shopmate-admin-key";

export const useAdminStore = create((set, get) => ({
  adminKey: sessionStorage.getItem(STORAGE_KEY) || "",
  isAdmin: !!sessionStorage.getItem(STORAGE_KEY),

  // throws if the password is wrong, so callers can catch and show an error
  login: async (password) => {
    await axios.get(`${BASE_URL}/api/admin/verify`, {
      headers: { "x-admin-key": password },
    });
    sessionStorage.setItem(STORAGE_KEY, password);
    set({ adminKey: password, isAdmin: true });
  },

  logout: () => {
    sessionStorage.removeItem(STORAGE_KEY);
    set({ adminKey: "", isAdmin: false });
  },

  // convenience helper for attaching the admin header to any request
  authHeader: () => ({ "x-admin-key": get().adminKey }),
}));

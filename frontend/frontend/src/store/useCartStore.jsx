import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // { id, name, price, image, quantity, stock }

      addToCart: (product) => {
        const { items } = get();
        const existing = items.find((item) => item.id === product.id);

        if (existing) {
          if (existing.quantity >= product.stock) {
            toast.error("No more stock available");
            return;
          }
          set({
            items: items.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          });
        } else {
          if (product.stock <= 0) {
            toast.error("This product is out of stock");
            return;
          }
          set({
            items: [
              ...items,
              {
                id: product.id,
                name: product.name,
                price: Number(product.price),
                image: product.image,
                stock: product.stock,
                quantity: 1,
              },
            ],
          });
        }
        toast.success(`${product.name} added to cart`);
      },

      increment: (id) => {
        const { items } = get();
        const item = items.find((i) => i.id === id);
        if (item && item.quantity >= item.stock) {
          toast.error("No more stock available");
          return;
        }
        set({
          items: items.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)),
        });
      },

      decrement: (id) => {
        const { items } = get();
        set({
          items: items
            .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
            .filter((i) => i.quantity > 0),
        });
      },

      removeFromCart: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
        toast.success("Removed from cart");
      },

      clearCart: () => set({ items: [] }),

      syncCart: (products) => {
        const { items } = get();
        const productIds = new Set(products.map((p) => p.id));
        set({ items: items.filter((item) => productIds.has(item.id)) });
      },

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "shopmate-cart-v1", // localStorage key (bumped to v2 to clear out any stale data from earlier versions)
      // defensive guard: if localStorage ever contains malformed/partial data
      // (e.g. from an older version of the app), drop it instead of crashing the app
      merge: (persistedState, currentState) => {
        const persisted = persistedState || {};
        const items = Array.isArray(persisted.items)
          ? persisted.items.filter(
              (i) =>
                i &&
                typeof i.id !== "undefined" &&
                typeof i.price === "number" &&
                typeof i.quantity === "number" &&
                i.quantity > 0
            )
          : [];
        return { ...currentState, ...persisted, items };
      },
    }
  )
);

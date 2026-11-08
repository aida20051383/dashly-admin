import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage.js";
import { initialCart } from "./data/mockCart.js";

const CartContext = createContext(null);

const clampQty = (qty) => Math.min(99, Math.max(1, qty));

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage("cart-v1", initialCart);

  const value = useMemo(() => {
    const sum = items.reduce((s, i) => s + i.price * i.qty, 0);

    return {
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      total: Math.round(sum * 100) / 100, // جلوگیری از خطای اعشاری
      addItem: (product) =>
        setItems((list) =>
          list.some((i) => i.id === product.id)
            ? list.map((i) =>
                i.id === product.id ? { ...i, qty: clampQty(i.qty + 1) } : i,
              )
            : [...list, { ...product, qty: 1 }],
        ),
      setQty: (id, qty) =>
        setItems((list) =>
          list.map((i) => (i.id === id ? { ...i, qty: clampQty(qty) } : i)),
        ),
      remove: (id) => setItems((list) => list.filter((i) => i.id !== id)),
      clear: () => setItems([]),
    };
  }, [items, setItems]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

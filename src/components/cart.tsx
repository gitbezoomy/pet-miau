"use client";

import Image from "next/image";
import type { Product } from "@/lib/products";
import { checkout } from "@/app/actions/checkout";
import { createContext, useContext, useMemo, useState, useSyncExternalStore } from "react";

const CART_STORAGE_KEY = "colorkit-cart";
const MAX_CART_QUANTITY = 20;
const ALLOWED_IMAGE_HOSTS: Record<string, true> = {
  "images.unsplash.com": true,
  "plus.unsplash.com": true,
  "images.pexels.com": true,
};

type CartProduct = Pick<Product, "id" | "title" | "price" | "image">;
type CartItem = CartProduct & {
  quantity: number;
};

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const item = value as Record<string, unknown>;
  let imageUrl: URL;

  try {
    imageUrl = new URL(String(item.image));
  } catch {
    return false;
  }

  return (
    Number.isSafeInteger(item.id) &&
    Number(item.id) > 0 &&
    typeof item.title === "string" &&
    item.title.length > 0 &&
    item.title.length <= 200 &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    item.price >= 0 &&
    typeof item.image === "string" &&
    item.image.length <= 2048 &&
    imageUrl.protocol === "https:" &&
    ALLOWED_IMAGE_HOSTS[imageUrl.hostname] === true &&
    Number.isSafeInteger(item.quantity) &&
    Number(item.quantity) > 0 &&
    Number(item.quantity) <= MAX_CART_QUANTITY
  );
}

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!storedCart) {
      return [];
    }

    const parsedCart: unknown = JSON.parse(storedCart);
    return Array.isArray(parsedCart) ? parsedCart.filter(isCartItem) : [];
  } catch {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
}

const CART_CHANGE_EVENT = "colorkit-cart-change";
const EMPTY_CART: CartItem[] = [];
let cartSnapshot: CartItem[] = typeof window === "undefined" ? EMPTY_CART : readStoredCart();

function subscribeToCart(callback: () => void) {
  const syncFromStorage = () => {
    cartSnapshot = readStoredCart();
    callback();
  };
  window.addEventListener("storage", syncFromStorage);
  window.addEventListener(CART_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", syncFromStorage);
    window.removeEventListener(CART_CHANGE_EVENT, callback);
  };
}

function getCartSnapshot() {
  return cartSnapshot;
}

function getServerCartSnapshot() {
  return EMPTY_CART;
}
function subscribeToHydration() {
  return () => {};
}

function getHydratedSnapshot() {
  return true;
}

function getServerHydratedSnapshot() {
  return false;
}
function persistCart(items: CartItem[]) {
  cartSnapshot = items;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Keep the in-memory cart usable when storage is unavailable.
  }
  window.dispatchEvent(new Event(CART_CHANGE_EVENT));
}

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  isOpen: boolean;
  isHydrated: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: CartProduct) => void;
  decreaseItem: (id: number) => void;
  removeItem: (id: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribeToCart, getCartSnapshot, getServerCartSnapshot);
  const isHydrated = useSyncExternalStore(subscribeToHydration, getHydratedSnapshot, getServerHydratedSnapshot);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (product: CartProduct) => {
    const currentItems = getCartSnapshot();
    const existingItem = currentItems.find((item) => item.id === product.id);

    if (existingItem) {
      if (existingItem.quantity >= MAX_CART_QUANTITY) {
        setIsOpen(true);
        return;
      }

      persistCart(currentItems.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      persistCart([...currentItems, { ...product, quantity: 1 }]);
    }
    setIsOpen(true);
  };

  const decreaseItem = (id: number) => {
    persistCart(
      getCartSnapshot()
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (id: number) => {
    persistCart(getCartSnapshot().filter((item) => item.id !== id));
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const value = useMemo(
    () => ({
      items,
      itemCount,
      isOpen,
      isHydrated,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      decreaseItem,
      removeItem,
    }),
    [isHydrated, isOpen, itemCount, items],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

export function CartTrigger() {
  const { itemCount, isHydrated, openCart } = useCart();

  return (
    <button type="button" onClick={openCart} aria-label="Abrir sacola" className="flex items-center gap-2 text-[10px] font-semibold uppercase leading-none tracking-[0.15em]">
      <BagIcon /> <span className="hidden sm:inline">Sacola</span> ({isHydrated ? itemCount : "—"})
    </button>
  );
}

export function AddToCartButton({ product, className = "" }: { product: Product; className?: string }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <button type="button" onClick={handleAdd} className={`inline-flex items-center justify-center gap-3 border border-[black] px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.18em] transition hover:bg-[black] hover:text-[white] ${className}`}>
      {added ? "Adicionado" : "Adicionar à sacola"}
    </button>
  );
}

function CartDrawer() {
  const { items, isOpen, closeCart, decreaseItem, addItem, removeItem } = useCart();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const checkoutWindow = window.open("about:blank", "_blank");
    if (!checkoutWindow) {
      setCheckoutError("Permita novas abas para abrir o WhatsApp.");
      return;
    }
    checkoutWindow.opener = null;
    setCheckoutError(null);
    setIsCheckingOut(true);

    try {
      const result = await checkout(new FormData(event.currentTarget));
      if (result.error || !result.url) {
        checkoutWindow.close();
        setCheckoutError(result.error ?? "Não foi possível abrir o WhatsApp.");
        return;
      }
      checkoutWindow.location.href = result.url;
    } catch {
      checkoutWindow.close();
      setCheckoutError("Não foi possível abrir o WhatsApp. Tente novamente.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-end" role="dialog" aria-modal="true" aria-label="Sua sacola">
      <button type="button" onClick={closeCart} aria-label="Fechar sacola" className="absolute inset-0 cursor-default bg-[black]/45" />
      <aside className="relative flex h-full w-full max-w-md flex-col bg-[white] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[black]/20 px-6 py-5 sm:px-8">
          <div>
            <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-[white]">Pet Miau e Miau</p>
            <h2 className="font-serif text-3xl tracking-[-0.04em]">Sua sacola</h2>
          </div>
          <button type="button" onClick={closeCart} aria-label="Fechar sacola" className="text-2xl font-light leading-none text-[zinc-400] hover:text-[black]">×</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-serif text-3xl tracking-[-0.04em]">Sua sacola está vazia.</p>
              <p className="mt-3 max-w-xs text-xs leading-5 text-[zinc-400]">Seu carrinho está vazio.</p>
              <button type="button" onClick={closeCart} className="mt-7 border-b border-[black] pb-2 text-[9px] font-semibold uppercase tracking-[0.18em]">Continuar explorando</button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-[black]/15 pb-6">
                  <div className="h-20 w-20 shrink-0 overflow-hidden bg-[zinc-900]"><Image src={item.image} alt="" width={80} height={80} className="h-full w-full object-cover" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-serif text-lg leading-tight">{item.title}</p>
                        <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-[zinc-400]">ID {item.id}</p>
                      </div>
                      <button type="button" onClick={() => removeItem(item.id)} aria-label={`Remover ${item.title}`} className="text-lg font-light text-[zinc-400] hover:text-[white]">×</button>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center border border-[black]/25">
                        <button type="button" onClick={() => decreaseItem(item.id)} aria-label={`Diminuir quantidade de ${item.title}`} className="px-2 py-1 text-sm">−</button>
                        <span className="min-w-7 text-center text-xs">{item.quantity}</span>
                        <button type="button" onClick={() => addItem(item)} aria-label={`Aumentar quantidade de ${item.title}`} className="px-2 py-1 text-sm">+</button>
                      </div>
                      <span className="text-sm">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[black]/20 px-6 py-6 sm:px-8">
            <div className="mb-5 flex items-end justify-between">
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[zinc-400]">Total</span>
              <span className="font-serif text-3xl tracking-[-0.04em]">R$ {total.toFixed(2)}</span>
            </div>
            <form onSubmit={handleCheckout}>
              <input type="hidden" name="items" value={JSON.stringify(items.map(({ id, quantity }) => ({ id, quantity })))} />
              <button type="submit" disabled={isCheckingOut} className="flex w-full items-center justify-center bg-[black] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[white] hover:bg-[white] disabled:cursor-wait disabled:opacity-60">{isCheckingOut ? "Abrindo WhatsApp..." : "Finalizar pelo WhatsApp"}</button>
            </form>
            {checkoutError && <p role="alert" className="mt-3 text-center text-xs text-[white]">{checkoutError}</p>}
            <p className="mt-3 text-center text-[9px] uppercase tracking-[0.12em] text-[white]">Preços validados no momento do checkout</p>
          </div>
        )}
      </aside>
    </div>
  );
}

function BagIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 8.5h14l-1 11H6l-1-11Z" />
      <path d="M9 9V6.5a3 3 0 0 1 6 0V9" />
    </svg>
  );
}

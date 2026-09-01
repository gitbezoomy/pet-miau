"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const whatsappNumber = process.env.WHATSAPP_NUMBER;
const MAX_CART_ITEMS = 20;
const MAX_CART_QUANTITY = 20;

type CheckoutItem = {
  id: number;
  quantity: number;
};

type CheckoutResult = {
  url?: string;
  error?: string;
};

function isCheckoutItem(value: unknown): value is CheckoutItem {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const item = value as Record<string, unknown>;
  return Number.isSafeInteger(item.id) && Number(item.id) > 0 && Number.isSafeInteger(item.quantity) && Number(item.quantity) > 0 && Number(item.quantity) <= MAX_CART_QUANTITY;
}

function invalidCheckout(): CheckoutResult {
  return { error: "Não foi possível validar sua sacola. Atualize a página e tente novamente." };
}

export async function checkout(formData: FormData): Promise<CheckoutResult> {
  const rawItems = formData.get("items");
  const supabase = await createSupabaseServerClient();

  if (!whatsappNumber || !/^\d{8,15}$/.test(whatsappNumber)) {
    return { error: "O checkout ainda não está configurado." };
  }


  if (typeof rawItems !== "string") {
    return invalidCheckout();
  }

  let parsedItems: unknown;
  try {
    parsedItems = JSON.parse(rawItems);
  } catch {
    return invalidCheckout();
  }

  if (!Array.isArray(parsedItems) || parsedItems.length === 0 || parsedItems.length > MAX_CART_ITEMS || !parsedItems.every(isCheckoutItem)) {
    return invalidCheckout();
  }

  const items = parsedItems as CheckoutItem[];
  const ids = items.map((item) => item.id);
  if (new Set(ids).size !== ids.length) {
    return invalidCheckout();
  }

  const { data: products, error } = await supabase
    .from("products")
    .select("id, title, price")
    .in("id", ids);

  if (error || !products || products.length !== ids.length) {
    return invalidCheckout();
  }

  const productsById = new Map(products.map((product) => [Number(product.id), product]));
  const messageLines: string[] = [];
  for (const item of items) {
    const product = productsById.get(item.id);
    if (!product) {
      return invalidCheckout();
    }

    const lineTotal = Number(product.price) * item.quantity;
    messageLines.push(`- ${product.title} (ID: ${item.id}) x${item.quantity} — R$ ${lineTotal.toFixed(2)}`);
  }

  const message = ["Olá! Quero comprar estes produtos da Pet Miau e Miau:", ...messageLines].join("\n");
  const checkoutUrl = new URL(`https://wa.me/${whatsappNumber}`);
  checkoutUrl.searchParams.set("text", message);
  return { url: checkoutUrl.toString() };
}

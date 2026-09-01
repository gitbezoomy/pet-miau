import { connection } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Product = {
  id: number;
  title: string;
  artist: string;
  price: number;
  image: string;
  category: string;
  description: string;
};

type ProductRow = Omit<Product, "price"> & {
  price: number | string;
};

const productColumns = "id, title, artist, price, image, category, description";

function mapProduct(row: ProductRow): Product {
  return {
    ...row,
    id: Number(row.id),
    price: Number(row.price),
  };
}

export async function getProducts(): Promise<Product[]> {
  await connection();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(productColumns)
    .order("id", { ascending: true });

  if (error) {
    throw new Error(`Unable to load products: ${error.message}`);
  }

  return (data as ProductRow[]).map(mapProduct);
}
export async function getProductById(id: number): Promise<Product | null> {
  await connection();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(productColumns)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load product ${id}: ${error.message}`);
  }

  return data ? mapProduct(data as ProductRow) : null;
}

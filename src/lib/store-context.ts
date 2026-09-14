import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";

/** Resolves today's single storefront without baking its database id into queries. */
export const getCurrentStore = cache(async () => {
  const slug = process.env.CURRENT_STORE_SLUG || "inevia-shop";
  const store = await db.store.findUnique({ where: { slug } });
  if (!store?.active) throw new Error("Loja indisponível.");
  return store;
});

export async function withCurrentStore<T>(query: (storeId: string) => Promise<T>) {
  const store = await getCurrentStore();
  return query(store.id);
}

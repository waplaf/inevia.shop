import "server-only";
import { db } from "@/lib/db";
import { getCurrentStore } from "@/lib/store-context";

export async function getCart(cartId?: string, sessionId?: string) {
  if (!cartId) return null;
  const store = await getCurrentStore();
  return db.cart.findFirst({
    where: { id: cartId, storeId: store.id, ...(sessionId ? { sessionId } : {}), OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
    include: { items: { orderBy: { id: "asc" }, include: { variant: true, product: { include: { images: { orderBy: { sortOrder: "asc" } } } } } } },
  });
}

export async function addCartItem(input: { cartId?: string; sessionId: string; productId: string; variantId?: string; quantity: number }) {
  const store = await getCurrentStore();
  return db.$transaction(async (tx) => {
    const product = await tx.product.findFirst({ where: { id: input.productId, storeId: store.id, status: "ACTIVE" } });
    if (!product) throw new Error("Produto não encontrado.");
    const variant = input.variantId ? await tx.productVariant.findFirst({ where: { id: input.variantId, productId: product.id, storeId: store.id, active: true } }) : null;
    const available = variant?.stock ?? product.stock;
    if (input.quantity > available) throw new Error("Quantidade indisponível.");
    let cart = input.cartId ? await tx.cart.findFirst({ where: { id: input.cartId, storeId: store.id } }) : null;
    cart ??= await tx.cart.create({ data: { storeId: store.id, sessionId: input.sessionId, expiresAt: new Date(Date.now() + 30 * 86400_000) } });
    const existing = await tx.cartItem.findFirst({ where: { cartId: cart.id, productId: product.id, variantId: variant?.id ?? null } });
    const quantity = (existing?.quantity ?? 0) + input.quantity;
    if (quantity > available) throw new Error("Quantidade indisponível.");
    const unitPrice = variant?.price ?? product.salePrice ?? product.price;
    if (existing) await tx.cartItem.update({ where: { id: existing.id }, data: { quantity, unitPrice } });
    else await tx.cartItem.create({ data: { cartId: cart.id, productId: product.id, variantId: variant?.id, quantity, unitPrice } });
    return cart.id;
  });
}

export async function updateCartItem(cartId: string, sessionId: string, itemId: string, quantity: number) {
  const cart = await getCart(cartId, sessionId);
  const item = cart?.items.find((candidate) => candidate.id === itemId);
  if (!cart || !item) throw new Error("Item não encontrado.");
  if (quantity === 0) return db.cartItem.delete({ where: { id: itemId } });
  if (quantity > (item.variant?.stock ?? item.product.stock)) throw new Error("Quantidade indisponível.");
  return db.cartItem.update({ where: { id: itemId }, data: { quantity } });
}

export async function removeCartItem(cartId: string, sessionId: string, itemId: string) {
  const cart = await getCart(cartId, sessionId);
  if (!cart?.items.some((item) => item.id === itemId)) throw new Error("Item não encontrado.");
  return db.cartItem.delete({ where: { id: itemId } });
}

export function cartTotals(cart: NonNullable<Awaited<ReturnType<typeof getCart>>>) {
  const subtotal = cart.items.reduce((total, item) => total + Number(item.unitPrice) * item.quantity, 0);
  return { itemCount: cart.items.reduce((total, item) => total + item.quantity, 0), subtotal };
}

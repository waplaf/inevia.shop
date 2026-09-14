import "server-only";
import { db } from "@/lib/db";
import { getCurrentStore } from "@/lib/store-context";

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  image: string;
  badge?: string;
  shortDescription: string;
  description: string;
  stock: number;
};

const include = { images: { orderBy: { sortOrder: "asc" as const } }, categories: { include: { category: true } } };

function serialize(product: Awaited<ReturnType<typeof findRaw>>[number]): CatalogProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.categories[0]?.category.name ?? "Produtos",
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : undefined,
    image: product.images.find((image) => image.primary)?.url ?? product.images[0]?.url ?? "/placeholder-product.svg",
    badge: product.onSale ? "Promoção" : product.featured ? "Destaque" : undefined,
    shortDescription: product.shortDescription,
    description: product.description,
    stock: product.stock,
  };
}

async function findRaw(storeId: string, query?: string, featured?: boolean) {
  return db.product.findMany({
    where: {
      storeId,
      status: "ACTIVE",
      ...(featured ? { featured: true } : {}),
      ...(query ? { OR: [{ name: { contains: query, mode: "insensitive" } }, { sku: { contains: query, mode: "insensitive" } }] } : {}),
    },
    include,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 48,
  });
}

export async function getProducts(query?: string) {
  const store = await getCurrentStore();
  return (await findRaw(store.id, query)).map(serialize);
}

export async function getFeaturedProducts(limit = 8) {
  const store = await getCurrentStore();
  return (await findRaw(store.id, undefined, true)).slice(0, limit).map(serialize);
}

export async function getProductBySlug(slug: string) {
  const store = await getCurrentStore();
  const product = await db.product.findUnique({ where: { storeId_slug: { storeId: store.id, slug } }, include });
  return product?.status === "ACTIVE" ? serialize(product) : null;
}

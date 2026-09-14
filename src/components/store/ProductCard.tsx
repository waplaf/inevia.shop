import { HeartIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { money } from "@/lib/catalog";
import type { CatalogProduct } from "@/lib/commerce/products";

type Product = Pick<CatalogProduct,"slug"|"name"|"category"|"price"|"salePrice"|"image"|"badge">;
export function ProductCard({p}:{p:Product}){return <article className="group relative"><Link href={`/produto/${p.slug}`} className="block"><div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100"><Image src={p.image} alt={p.name} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-[1.03]"/>{p.badge&&<span className="absolute left-3 top-3 rounded-full bg-neutral-950 px-3 py-1 text-[11px] font-semibold text-white">{p.badge}</span>}</div><div className="pt-4"><p className="text-xs text-neutral-500">{p.category}</p><h3 className="mt-1 font-semibold tracking-tight text-neutral-950">{p.name}</h3><div className="mt-2 flex items-center gap-2"><strong className="text-sm text-neutral-950">{money(p.salePrice??p.price)}</strong>{p.salePrice&&<del className="text-xs text-neutral-400">{money(p.price)}</del>}</div></div></Link><button aria-label={`Adicionar ${p.name} aos favoritos`} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm"><HeartIcon className="h-5 w-5"/></button></article>}

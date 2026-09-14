import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { addCartItem, cartTotals, getCart } from "@/lib/commerce/cart";

const addSchema=z.object({productId:z.string().cuid(),variantId:z.string().cuid().optional(),quantity:z.number().int().min(1).max(99)});
export async function GET(){const jar=await cookies();const cart=await getCart(jar.get("inevia_cart")?.value,jar.get("inevia_cart_session")?.value);return NextResponse.json(cart?{cart,totals:cartTotals(cart)}:{cart:null,totals:{itemCount:0,subtotal:0}})}
export async function POST(request:Request){const parsed=addSchema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"Item inválido."},{status:400});const jar=await cookies();const sessionId=jar.get("inevia_cart_session")?.value??randomUUID();try{const cartId=await addCartItem({cartId:jar.get("inevia_cart")?.value,sessionId,...parsed.data});const response=NextResponse.json({ok:true,cartId},{status:201});const options={httpOnly:true,sameSite:"lax" as const,secure:process.env.NODE_ENV==="production",path:"/",maxAge:30*86400};response.cookies.set("inevia_cart",cartId,options);response.cookies.set("inevia_cart_session",sessionId,options);return response}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Não foi possível actualizar o carrinho."},{status:409})}}

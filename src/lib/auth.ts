import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
export type Session={userId:string;email:string;role:"SUPER_ADMIN"|"ADMIN"|"STORE_MANAGER"|"PRODUCT_MANAGER"|"ORDER_MANAGER"|"CASHIER"|"CUSTOMER";storeId?:string};
const key=()=>new TextEncoder().encode(process.env.AUTH_SECRET||"development-secret-change-in-production");
export async function createSession(value:Session){const token=await new SignJWT(value).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(key());(await cookies()).set("inevia_session",token,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",maxAge:604800});}
export async function getSession(){const token=(await cookies()).get("inevia_session")?.value;if(!token)return null;try{return (await jwtVerify(token,key())).payload as unknown as Session}catch{return null}}
export const ADMIN_ROLES=["SUPER_ADMIN","ADMIN","STORE_MANAGER","PRODUCT_MANAGER","ORDER_MANAGER"];
export const PRODUCT_ROLES=["SUPER_ADMIN","ADMIN","STORE_MANAGER","PRODUCT_MANAGER"];
export async function requireAdmin(){const session=await getSession();if(!session||!session.storeId||!ADMIN_ROLES.includes(session.role))redirect("/login?next=/admin");const membership=await db.storeMembership.findUnique({where:{storeId_userId:{storeId:session.storeId,userId:session.userId}}});if(!membership?.active||!ADMIN_ROLES.includes(membership.role))redirect("/login?next=/admin");return {...session,role:membership.role}}
export async function requireProductManager(){const session=await requireAdmin();if(!PRODUCT_ROLES.includes(session.role))redirect("/admin");return session}

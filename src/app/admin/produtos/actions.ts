"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireProductManager } from "@/lib/auth";

const productSchema=z.object({name:z.string().trim().min(3).max(160),slug:z.string().trim().min(3).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),sku:z.string().trim().min(2).max(80),shortDescription:z.string().trim().min(3).max(300),description:z.string().trim().min(3).max(20_000),price:z.coerce.number().positive(),salePrice:z.union([z.literal(""),z.coerce.number().positive()]).optional(),stock:z.coerce.number().int().min(0),imageUrl:z.union([z.literal(""),z.url()]).optional(),featured:z.coerce.boolean().default(false)});

export type ProductActionState={error?:string};

export async function createProduct(_:ProductActionState,formData:FormData):Promise<ProductActionState>{
 const session=await requireProductManager();
 const parsed=productSchema.safeParse(Object.fromEntries(formData));
 if(!parsed.success)return {error:parsed.error.issues[0]?.message??"Dados inválidos."};
 const data=parsed.data;
 try{
  await db.$transaction(async tx=>{
   const product=await tx.product.create({data:{storeId:session.storeId!,name:data.name,slug:data.slug,sku:data.sku,shortDescription:data.shortDescription,description:data.description,price:data.price,salePrice:data.salePrice===""?null:data.salePrice,stock:data.stock,status:"ACTIVE",featured:data.featured,images:data.imageUrl?{create:{url:data.imageUrl,alt:data.name,primary:true}}:undefined}});
   const location=await tx.location.findFirst({where:{storeId:session.storeId!,type:"WAREHOUSE",active:true},orderBy:{createdAt:"asc"}});
   if(location)await tx.inventoryLevel.create({data:{locationId:location.id,productId:product.id,sku:product.sku,available:data.stock}});
  });
 }catch{return {error:"Não foi possível criar o produto. Confirme se o slug e o SKU são únicos."}}
 revalidatePath("/");revalidatePath("/produtos");revalidatePath("/admin/produtos");redirect("/admin/produtos");
}

export async function archiveProduct(formData:FormData){const session=await requireProductManager();const id=z.string().cuid().parse(formData.get("id"));await db.product.updateMany({where:{id,storeId:session.storeId},data:{status:"ARCHIVED"}});revalidatePath("/");revalidatePath("/produtos");revalidatePath("/admin/produtos");}

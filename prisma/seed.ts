import { PrismaClient, ProductStatus, Role } from "@prisma/client";
import { hash } from "bcryptjs";
const db = new PrismaClient();
const products = [
  ["Smartphone Nova X", "smartphone-nova-x", "Tecnologia rápida para todos os dias.", 24990, "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80"],
  ["Auscultadores AirBeat", "auscultadores-airbeat", "Som nítido, conforto e liberdade sem fios.", 3490, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"],
  ["Mochila Urban", "mochila-urban", "Design resistente para trabalho e viagem.", 2890, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80"],
  ["Ténis Motion", "tenis-motion", "Leveza e estabilidade em cada passo.", 4590, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"],
] as const;
async function main() {
  const passwordHash = await hash(process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!", 12);
  const admin=await db.user.upsert({ where:{email:process.env.SEED_ADMIN_EMAIL || "admin@inevia.shop"}, update:{}, create:{email:process.env.SEED_ADMIN_EMAIL || "admin@inevia.shop",name:"Administrador Inevia",passwordHash,role:Role.SUPER_ADMIN} });
  const store=await db.store.upsert({where:{slug:"inevia-shop"},update:{},create:{name:"Inevia.shop",slug:"inevia-shop",legalName:"Inevia.shop",ownerId:admin.id}});
  await db.storeMembership.upsert({where:{storeId_userId:{storeId:store.id,userId:admin.id}},update:{role:Role.SUPER_ADMIN,active:true},create:{storeId:store.id,userId:admin.id,role:Role.SUPER_ADMIN}});
  const category = await db.category.upsert({where:{storeId_slug:{storeId:store.id,slug:"destaques"}},update:{},create:{storeId:store.id,name:"Destaques",slug:"destaques",description:"A selecção Inevia"}});
  const brand = await db.brand.upsert({where:{storeId_slug:{storeId:store.id,slug:"inevia"}},update:{},create:{storeId:store.id,name:"Inevia",slug:"inevia"}});
  for (let i=0;i<products.length;i++) { const [name,slug,shortDescription,price,url]=products[i]; await db.product.upsert({where:{storeId_slug:{storeId:store.id,slug}},update:{},create:{storeId:store.id,name,slug,shortDescription,description:shortDescription,price,salePrice:i===1?2990:null,sku:`INE-${100+i}`,stock:15+i*4,status:ProductStatus.ACTIVE,featured:true,onSale:i===1,brandId:brand.id,categories:{create:{categoryId:category.id}},images:{create:{url,alt:name,primary:true}}}}); }
  await db.storeSettings.upsert({where:{storeId:store.id},update:{},create:{storeId:store.id,paymentMethods:{mpesa:true,emola:true,stripe:false,bankTransfer:true,cashOnDelivery:true},shippingMethods:{maputo:250,matola:200,national:500},freeShippingAbove:10000}});
  await db.banner.upsert({where:{id:"home-hero"},update:{storeId:store.id},create:{id:"home-hero",storeId:store.id,title:"Tudo o que precisa, mais perto de si",subtitle:"Tecnologia, moda e essenciais com entrega segura em Moçambique.",imageUrl:"https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1600&q=80",ctaLabel:"Comprar agora",ctaUrl:"/produtos"}});
}
main().finally(()=>db.$disconnect());

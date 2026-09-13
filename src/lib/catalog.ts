export const demoProducts=[
 {id:"1",slug:"smartphone-nova-x",name:"Smartphone Nova X",category:"Tecnologia",price:24990,image:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",badge:"Destaque"},
 {id:"2",slug:"auscultadores-airbeat",name:"Auscultadores AirBeat",category:"Tecnologia",price:3490,salePrice:2990,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",badge:"Promoção"},
 {id:"3",slug:"mochila-urban",name:"Mochila Urban",category:"Moda",price:2890,image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80"},
 {id:"4",slug:"tenis-motion",name:"Ténis Motion",category:"Desporto",price:4590,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"},
];
export const money=(n:number)=>new Intl.NumberFormat("pt-MZ",{style:"currency",currency:"MZN",maximumFractionDigits:0}).format(n);

export const money=(n:number)=>new Intl.NumberFormat("pt-MZ",{style:"currency",currency:"MZN",maximumFractionDigits:0}).format(n);

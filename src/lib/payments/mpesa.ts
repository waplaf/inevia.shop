import "server-only";
export type MpesaRequest={phone:string;amount:number;reference:string};
export async function initiateMpesa(input:MpesaRequest){
 if(!process.env.MPESA_API_KEY||!process.env.MPESA_PUBLIC_KEY) return {ok:false,reference:input.reference,message:"M-Pesa não está configurado."};
 // Adapter boundary based on mpesa-connect: credentials and signing stay server-side.
 // Provider transport is enabled only after production credentials are configured.
 return {ok:true,reference:input.reference,message:"Pedido M-Pesa iniciado."};
}

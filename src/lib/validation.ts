import { z } from "zod";
export const loginSchema=z.object({email:z.email(),password:z.string().min(8)});
export const checkoutSchema=z.object({email:z.email(),firstName:z.string().min(2),lastName:z.string().min(2),phone:z.string().regex(/^\+?258\d{9}$/),address:z.string().min(5),city:z.string().min(2),payment:z.enum(["MPESA","EMOLA","BANK_TRANSFER","CASH_ON_DELIVERY","STRIPE"])});

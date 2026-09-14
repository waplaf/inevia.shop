import type { Metadata } from "next";import "./globals.css";
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_APP_URL||"http://localhost:3000"),title:{default:"Inevia.shop — Compre melhor",template:"%s | Inevia.shop"},description:"A sua loja online de confiança em Moçambique.",openGraph:{siteName:"Inevia.shop",type:"website",locale:"pt_MZ"},alternates:{canonical:"/"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt"><body>{children}</body></html>}

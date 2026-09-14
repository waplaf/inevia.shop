"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";

const navigation = [{ label: "Todos", href: "/produtos" }, { label: "Novidades", href: "/produtos?ordem=novidades" }, { label: "Destaques", href: "/produtos?destaque=true" }];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return <>
    <div className="bg-neutral-950 px-4 py-2 text-center text-xs font-medium text-white">Envios para todo Moçambique · Entrega grátis acima de 10.000 MT</div>
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="container flex h-16 items-center gap-5">
        <button className="rounded-md p-2 md:hidden" onClick={() => setMobileOpen(true)} aria-label="Abrir menu"><Bars3Icon className="h-6 w-6" /></button>
        <Link href="/" className="shrink-0 text-xl font-black tracking-tight">INEVIA<span className="text-green-600">.SHOP</span></Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex" aria-label="Navegação principal">{navigation.map(item => <Link key={item.href} href={item.href} className="hover:text-green-700">{item.label}</Link>)}</nav>
        <form action="/produtos" className="relative ml-auto hidden w-full max-w-sm lg:block"><label className="sr-only" htmlFor="search">Pesquisar</label><input id="search" name="q" className="!rounded-full !border-neutral-300 !py-2 !pl-10" placeholder="Pesquisar produtos"/><MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-neutral-500"/></form>
        <div className="ml-auto flex items-center gap-1 lg:ml-2"><Link href="/produtos" className="rounded-full p-2 lg:hidden" aria-label="Pesquisar"><MagnifyingGlassIcon className="h-6 w-6"/></Link><Link href="/conta" className="rounded-full p-2" aria-label="A minha conta"><UserIcon className="h-6 w-6"/></Link><Link href="/carrinho" className="relative rounded-full p-2" aria-label="Carrinho"><ShoppingBagIcon className="h-6 w-6"/><span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-green-600 px-1 text-[10px] font-bold text-white">0</span></Link></div>
      </div>
    </header>
    <Dialog open={mobileOpen} onClose={setMobileOpen} className="relative z-50 md:hidden"><div className="fixed inset-0 bg-black/30" aria-hidden="true"/><DialogPanel className="fixed inset-y-0 left-0 w-full max-w-xs bg-white p-6 shadow-xl"><div className="flex items-center justify-between"><DialogTitle className="font-black tracking-tight">INEVIA<span className="text-green-600">.SHOP</span></DialogTitle><button onClick={() => setMobileOpen(false)} aria-label="Fechar menu"><XMarkIcon className="h-6 w-6"/></button></div><nav className="mt-10 grid gap-1">{navigation.map(item=><Link onClick={()=>setMobileOpen(false)} key={item.href} href={item.href} className="border-b border-neutral-100 py-4 text-lg font-semibold">{item.label}</Link>)}</nav></DialogPanel></Dialog>
  </>;
}

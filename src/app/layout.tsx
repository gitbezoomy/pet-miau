import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { AuthControls } from "@/components/auth-controls";
import { CartProvider, CartTrigger } from "@/components/cart";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pet Miau e Miau",
  description: "Tudo para o seu pet.",
};

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10.8" cy="10.8" r="6.4" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-black text-white">
        <CartProvider>
        <div className="border-b border-white/15 bg-zinc-900 px-4 py-2 text-center text-[9px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
          Frete grátis para pedidos acima de R$ 180
        </div>

        <header className="relative z-50 border-b border-white/20 bg-black">
          <nav className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
            <div className="grid min-h-[88px] grid-cols-[1fr_auto_1fr] items-center gap-4">
              <div className="hidden items-center gap-7 md:flex">
                <Link href="/" className="text-[10px] font-semibold uppercase tracking-[0.18em] transition hover:text-zinc-300">Todos</Link>
                <Link href="/#cachorro" className="text-[10px] font-semibold uppercase tracking-[0.18em] transition hover:text-zinc-300">Cachorro</Link>
                <Link href="/#gatos" className="text-[10px] font-semibold uppercase tracking-[0.18em] transition hover:text-zinc-300">Gatos</Link>
              </div>
              <Link href="/" className="flex flex-col items-center justify-center text-center font-serif text-3xl leading-none tracking-[-0.05em]">
                <Image src="/logo.svg" alt="Pet Miau e Miau Logo" width={40} height={40} className="mb-2" />
                <div className="flex flex-col">
                  <span>Pet Miau</span>
                  <span className="mt-1 block font-sans text-[8px] font-semibold uppercase tracking-[0.42em] text-zinc-400">e miau</span>
                </div>
              </Link>
              <div className="flex items-center justify-end gap-5">
                <Link href="/#produtos" aria-label="Pesquisar produtos" className="hidden items-center gap-2 text-[10px] font-semibold uppercase leading-none tracking-[0.15em] sm:flex">
                  <SearchIcon /> Buscar
                </Link>
                <AuthControls />
                <CartTrigger />
              </div>
            </div>
            <div className="flex gap-6 overflow-x-auto border-t border-white/10 py-3 md:hidden">
              <Link href="/" className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.18em]">Todos</Link>
              <Link href="/#cachorro" className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.18em]">Cachorro</Link>
              <Link href="/#gatos" className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.18em]">Gatos</Link>
            </div>
          </nav>
        </header>

        <main className="w-full">{children}</main>

        <footer className="border-t border-white/20 bg-black text-white">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-16 lg:py-16">
            <div>
              <p className="font-serif text-3xl tracking-[-0.04em]">Pet Miau e Miau</p>
              <p className="mt-4 max-w-xs text-xs leading-5 text-white/60">Tudo para o seu pet.</p>
            </div>
            <div>
              <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.24em] text-white">Explore</p>
              <div className="flex flex-col gap-3 text-xs text-white/75">
                <Link href="/">Todos</Link>
                <Link href="/#cachorro">Cachorro</Link>
                <Link href="/#gatos">Gatos</Link>
              </div>
            </div>
            <div>
              <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.24em] text-white">Fale com a gente</p>
              <p className="max-w-xs text-xs leading-5 text-white/75">Receba novidades e ofertas.</p>
              <a href="mailto:contato@petmiauemiau.com.br" className="mt-4 inline-block border-b border-white/40 pb-1 text-xs">contato@petmiauemiau.com.br</a>
            </div>
          </div>
          <div className="border-t border-white/15 px-6 py-4 text-center text-[9px] uppercase tracking-[0.18em] text-white/45">
            © {new Date().getFullYear()} Pet Miau e Miau
          </div>
        </footer>
        <Analytics />
        </CartProvider>
      </body>
    </html>
  );
}

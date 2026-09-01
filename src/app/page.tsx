import Image from "next/image";
import Link from "next/link";
import { getProducts, type Product } from "@/lib/products";
import { AddToCartButton } from "@/components/cart";

const heroImage = "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1600";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <article className="group">
      <Link href={`/product/${product.id}`} className="relative block aspect-[0.82] overflow-hidden bg-zinc-900 border border-white/10 rounded-xl">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 30vw"
        />
        <span className="absolute left-3 top-3 bg-black/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white rounded-md border border-white/20">
          {product.category}
        </span>
        <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black opacity-0 transition group-hover:opacity-100">
          <ArrowIcon />
        </span>
      </Link>
      <div className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="mb-1 text-[9px] uppercase tracking-[0.18em] text-zinc-400">{product.artist}</p>
            <Link href={`/product/${product.id}`} className="font-serif text-xl leading-tight tracking-[-0.02em] hover:text-zinc-300 sm:text-2xl">
              {product.title}
            </Link>
          </div>
          <span className="shrink-0 pt-1 text-sm">R$ {product.price.toFixed(2)}</span>
        </div>
        <p className="mt-3 hidden max-w-xs text-xs leading-5 text-zinc-400 sm:block">{product.description}</p>
        <AddToCartButton product={product} className="mt-4 w-full sm:w-auto border-white text-white hover:bg-white hover:text-black" />
      </div>
      {index === 2 && <div className="mt-7 h-px bg-white/20 sm:hidden" />}
    </article>
  );
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="bg-black text-white">
      <section className="relative min-h-[670px] overflow-hidden border-b border-white/20 bg-zinc-950">
        <Image
          src={heroImage}
          alt="Cães e gatos"
          fill
          priority
          className="object-cover object-center opacity-50 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="relative mx-auto flex min-h-[670px] max-w-[1440px] items-end px-6 pb-16 sm:px-10 sm:pb-20 lg:px-16">
          <div className="max-w-2xl text-white">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.32em] text-zinc-400">Produtos Selecionados</p>
            <h1 className="max-w-xl font-serif text-5xl leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-[92px]">
              Tudo para o seu pet.
            </h1>
            <p className="mt-7 max-w-md text-sm leading-6 text-zinc-300 sm:text-base">
              Acessórios e brinquedos pensados no bem-estar do seu melhor amigo.
            </p>
            <Link
              href="#produtos"
              className="mt-9 inline-flex items-center gap-5 border border-white px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.24em] transition hover:bg-white hover:text-black rounded-full"
            >
              Ver Produtos
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <section id="produtos" className="mx-auto max-w-[1440px] px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mb-10 flex items-end justify-between gap-6 border-b border-white/20 pb-5">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-400">Para gatos e cachorros</p>
            <h2 className="font-serif text-4xl tracking-[-0.04em] sm:text-5xl">Destaques</h2>
          </div>
          <Link href="#todos-os-kits" className="hidden items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] sm:flex">
            Ver todos <ArrowIcon />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 sm:gap-x-6 lg:gap-x-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>

      <section className="border-y border-white/20 bg-zinc-950">
        <div className="mx-auto grid max-w-[1440px] items-stretch lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-[420px] overflow-hidden lg:min-h-[540px]">
            <Image
              src="https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200"
              alt="Gato descansando"
              fill
              className="object-cover mix-blend-luminosity opacity-80"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </div>
          <div className="flex flex-col justify-center px-6 py-14 sm:px-12 lg:px-20 lg:py-20">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-400">Conforto e Diversão</p>
            <h2 className="max-w-lg font-serif text-4xl leading-[1.02] tracking-[-0.04em] sm:text-6xl">
              Qualidade que seu pet merece.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-6 text-zinc-400">
              Escolha os melhores acessórios para o dia a dia do seu pet. 
            </p>
            <Link href="#produtos" className="mt-9 inline-flex w-fit items-center gap-4 border-b border-white pb-2 text-[10px] font-semibold uppercase tracking-[0.2em]">
              Ver coleção <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

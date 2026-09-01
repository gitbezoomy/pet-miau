import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/cart";
import { getProductById } from "@/lib/products";

function ArrowBackIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M19 12H5m6 6-6-6 6-6" />
    </svg>
  );
}


export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id, 10);
  const product = await getProductById(productId);


  if (!product) {
    notFound();
  }


  return (
    <div className="bg-[#f8f5ee]">
      <div className="mx-auto max-w-[1440px] px-6 pb-20 pt-8 sm:px-10 sm:pt-12 lg:px-16">
        <Link href="/" className="mb-8 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#65685f] hover:text-[#8e5b3c]">
          <ArrowBackIcon /> Voltar para a seleção
        </Link>

        <div className="grid border-y border-[#1e211d]/20 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative aspect-[0.9] min-h-[420px] overflow-hidden bg-[#e5dfd2] lg:aspect-auto lg:min-h-[680px]">
            <Image
              src={product.image}
              alt={product.title}
              fill
              priority
              className="object-cover transition duration-700 hover:scale-[1.02]"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
            <span className="absolute left-5 top-5 bg-[#f8f5ee]/90 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8e5b3c]">
              {product.category}
            </span>
          </div>

          <div className="flex flex-col justify-between px-6 py-10 sm:px-12 sm:py-14 lg:px-20 lg:py-20">
            <div>
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8e5b3c]">{product.artist}</p>
              <h1 className="max-w-lg font-serif text-5xl leading-[0.95] tracking-[-0.05em] sm:text-7xl">{product.title}</h1>
              <p className="mt-8 max-w-md text-sm leading-6 text-[#65685f]">{product.description}</p>
            </div>

            <div className="mt-16">
              <div className="mb-7 flex items-end justify-between border-b border-[#1e211d]/20 pb-5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#65685f]">Edição ColorKit</span>
                <span className="font-serif text-3xl tracking-[-0.04em]">R$ {product.price.toFixed(2)}</span>
              </div>
              <AddToCartButton
                product={product}
                className="w-full bg-[#1e211d] text-[#f8f5ee] hover:bg-[#8e5b3c]"
              />
              <p className="mt-4 text-center text-[10px] uppercase tracking-[0.14em] text-[#8e5b3c]">Finalize sua seleção pelo WhatsApp na sacola</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 border-b border-[#1e211d]/20 py-10 text-sm text-[#65685f] sm:grid-cols-3">
          <div>
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#1e211d]">O que vem dentro</p>
            <p>Ilustrações selecionadas, materiais de qualidade e uma nova página para colecionar.</p>
          </div>
          <div>
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#1e211d]">Como funciona</p>
            <p>Você recebe o kit, cria no seu tempo e envia a foto da obra para o seu álbum.</p>
          </div>
          <div>
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#1e211d]">Feito para compartilhar</p>
            <p>Cada desenho é uma lembrança. Convide alguém para pintar junto.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

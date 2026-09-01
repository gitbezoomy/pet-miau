create table if not exists public.products (
  id bigint primary key,
  title text not null,
  artist text not null,
  price numeric(10, 2) not null check (price >= 0),
  image text not null,
  category text not null,
  description text not null
);

grant select on table public.products to anon, authenticated;

alter table public.products enable row level security;

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
  on public.products
  for select
  to anon, authenticated
  using (true);

insert into public.products (id, title, artist, price, image, category, description)
values
  (1, 'Kit Aventura Animal', 'Coleção Kids', 89.90, 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop', 'Lápis de Cor', 'Um kit completo com 10 desenhos incríveis de animais da selva, caixa com 24 lápis de cor e adesivos exclusivos para seu álbum!'),
  (2, 'Kit Universo Espacial', 'Coleção Descoberta', 110.00, 'https://images.unsplash.com/photo-1620336655055-088d06e36bf0?q=80&w=800&auto=format&fit=crop', 'Canetinhas', 'Explore o espaço! Contém 8 ilustrações de planetas e astronautas, estojo com 12 canetinhas vibrantes e card secreto.'),
  (3, 'Kit Jardim Encantado', 'Coleção Magia', 135.00, 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop', 'Aquarela', 'Para os pequenos artistas! 12 desenhos florais em papel especial, 1 estojo de aquarela com pincel.'),
  (4, 'Kit Dinossauros', 'Coleção Kids', 75.00, 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=800&auto=format&fit=crop', 'Lápis de Cor', 'Viaje no tempo com 15 desenhos de dinossauros diferentes. Inclui caixa de lápis de cor com cores terrosas.'),
  (5, 'Kit Fundo do Mar', 'Coleção Magia', 95.00, 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=800&auto=format&fit=crop', 'Giz de Cera', 'Descubra o oceano! Desenhos de peixes e sereias acompanhados de giz de cera super macio.'),
  (6, 'Megakit Criatividade', 'Coleção Premium', 250.00, 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?q=80&w=800&auto=format&fit=crop', 'Misto', 'O pacote supremo! Lápis, canetinhas, giz, tintas e 30 desenhos exclusivos. Rende muitas figurinhas no álbum!')
on conflict (id) do nothing;

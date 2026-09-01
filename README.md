# Pet Miau e Miau E-Commerce

Plataforma de e-commerce construída com Next.js e Supabase.

## Configuração

1. Clone o repositório.
2. Instale as dependências: `npm install`.
3. Crie um arquivo `.env.local` baseado no `.env.example` e preencha suas chaves do Supabase.
4. Execute o servidor de desenvolvimento: `npm run dev`.

## Variáveis de Ambiente Necessárias

As seguintes chaves devem estar configuradas no Vercel e no seu `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `WHATSAPP_NUMBER`

## Deploy

Conecte este repositório no [Vercel](https://vercel.com/) e adicione as variáveis de ambiente na aba de configurações do projeto antes de fazer o deploy.

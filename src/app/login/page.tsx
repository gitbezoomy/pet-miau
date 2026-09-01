import Link from "next/link";
import { signIn, signUp } from "@/app/login/actions";
import { AuthVerificationNotice } from "@/components/auth-verification-notice";
import { safeReturnPath } from "@/lib/auth/return-path";

function messageForCode(code: string | undefined) {
  switch (code) {
    case "auth":
      return "Não foi possível confirmar sua conta. Solicite um novo e-mail de confirmação.";
    case "check-email":
      return "Confira seu e-mail para confirmar a conta antes de entrar.";
    case "config":
      return "O cadastro ainda não está configurado para este ambiente.";
    case "invalid":
      return "Não foi possível entrar. Confira seu e-mail e senha.";
    case "signup":
      return "Não foi possível criar a conta. Tente novamente com outro e-mail.";
    default:
      return null;
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; next?: string }>;
}) {
  const params = await searchParams;
  const next = safeReturnPath(params.next);
  const verificationKind = params.message === "check-email" ? "signup" : params.error === "unverified" ? "login" : null;
  const message = verificationKind ? null : messageForCode(params.error ?? params.message);

  return (
    <>
      {verificationKind && <AuthVerificationNotice kind={verificationKind} />}
      <div className="min-h-[calc(100vh-220px)] bg-[#f8f5ee]">
      <div className="mx-auto grid max-w-[1100px] gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-16 lg:py-24">
        <div>
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8e5b3c]">Meu álbum</p>
          <h1 className="max-w-md font-serif text-6xl leading-[0.95] tracking-[-0.05em]">Guarde o que você criou.</h1>
          <p className="mt-7 max-w-sm text-sm leading-6 text-[#65685f]">Entre para acompanhar suas figurinhas e continuar construindo seu álbum ColorKit.</p>
          <Link href="/" className="mt-9 inline-flex border-b border-[#1e211d] pb-2 text-[10px] font-semibold uppercase tracking-[0.2em]">Voltar para os kits</Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <form action={signIn} className="border-y border-[#1e211d]/20 py-7">
            <input type="hidden" name="next" value={next} />
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8e5b3c]">Já tenho uma conta</p>
            <h2 className="font-serif text-3xl tracking-[-0.04em]">Entrar</h2>
            <label className="mt-7 block text-[10px] font-semibold uppercase tracking-[0.16em]">
              E-mail
              <input name="email" type="email" autoComplete="email" required className="mt-2 block w-full border-b border-[#1e211d]/30 bg-transparent px-0 py-3 text-sm font-normal outline-none focus:border-[#8e5b3c]" />
            </label>
            <label className="mt-5 block text-[10px] font-semibold uppercase tracking-[0.16em]">
              Senha
              <input name="password" type="password" autoComplete="current-password" minLength={8} required className="mt-2 block w-full border-b border-[#1e211d]/30 bg-transparent px-0 py-3 text-sm font-normal outline-none focus:border-[#8e5b3c]" />
            </label>
            <button type="submit" className="mt-8 w-full bg-[#1e211d] px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f8f5ee] hover:bg-[#8e5b3c]">Entrar</button>
          </form>

          <form action={signUp} className="border-y border-[#1e211d]/20 py-7">
            <input type="hidden" name="next" value={next} />
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8e5b3c]">Primeira vez aqui?</p>
            <h2 className="font-serif text-3xl tracking-[-0.04em]">Criar conta</h2>
            <label className="mt-7 block text-[10px] font-semibold uppercase tracking-[0.16em]">
              E-mail
              <input name="email" type="email" autoComplete="email" required className="mt-2 block w-full border-b border-[#1e211d]/30 bg-transparent px-0 py-3 text-sm font-normal outline-none focus:border-[#8e5b3c]" />
            </label>
            <label className="mt-5 block text-[10px] font-semibold uppercase tracking-[0.16em]">
              Senha
              <input name="password" type="password" autoComplete="new-password" minLength={8} required className="mt-2 block w-full border-b border-[#1e211d]/30 bg-transparent px-0 py-3 text-sm font-normal outline-none focus:border-[#8e5b3c]" />
            </label>
            <button type="submit" className="mt-8 w-full border border-[#1e211d] px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-[#1e211d] hover:text-[#f8f5ee]">Criar conta</button>
          </form>
        </div>

        {message && <p role="status" className="text-sm text-[#8e5b3c] sm:col-span-2">{message}</p>}
      </div>
      </div>
    </>
  );
}

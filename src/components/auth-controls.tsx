import Link from "next/link";
import { signOut } from "@/app/login/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function AuthControls() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims?.sub) {
    return <Link href="/login" className="inline-flex h-4 items-center leading-none text-[10px] font-semibold uppercase tracking-[0.15em]">Entrar</Link>;
  }

  return (
    <form action={signOut} className="flex items-center">
      <button type="submit" className="inline-flex h-4 items-center leading-none text-[10px] font-semibold uppercase tracking-[0.15em]">Sair</button>
    </form>
  );
}

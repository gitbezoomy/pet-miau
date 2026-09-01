"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { safeReturnPath } from "@/lib/auth/return-path";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeReturnPath(formData.get("next"));

  if (!email || password.length < 8) {
    redirect(`/login?error=invalid&next=${encodeURIComponent(next)}`);
  }
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  const errorCode = error?.code ?? "";
  const errorMessage = error?.message.toLowerCase() ?? "";

  if (error && (errorCode === "email_not_confirmed" || errorMessage.includes("email not confirmed"))) {
    redirect(`/login?error=unverified&next=${encodeURIComponent(next)}`);
  }

  if (error) {
    redirect(`/login?error=invalid&next=${encodeURIComponent(next)}`);
  }

  redirect(next);
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeReturnPath(formData.get("next"));

  if (!email || password.length < 8) {
    redirect(`/login?error=invalid&next=${encodeURIComponent(next)}`);
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.NODE_ENV === "development" ? "http://localhost:3000" : null);
  if (!siteUrl) {
    redirect(`/login?error=config&next=${encodeURIComponent(next)}`);
  }
  const emailRedirectUrl = new URL("/auth/callback", siteUrl);
  emailRedirectUrl.searchParams.set("next", next);


  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: emailRedirectUrl.toString() },
  });

  if (error) {
    redirect(`/login?error=signup&next=${encodeURIComponent(next)}`);
  }

  if (!data.session) {
    redirect(`/login?message=check-email&next=${encodeURIComponent(next)}`);
  }

  redirect(next);
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

"use client";

import { useState } from "react";

type VerificationKind = "signup" | "login";

const noticeCopy: Record<VerificationKind, { title: string; body: string }> = {
  signup: {
    title: "Confirme seu e-mail",
    body: "Sua conta foi criada. Enviamos um link de confirmação para o seu e-mail. Confirme o endereço antes de entrar no seu álbum.",
  },
  login: {
    title: "E-mail ainda não confirmado",
    body: "Sua conta precisa ser confirmada antes do primeiro acesso. Use o link enviado para o seu e-mail e tente entrar novamente.",
  },
};

export function AuthVerificationNotice({ kind }: { kind: VerificationKind }) {
  const [isOpen, setIsOpen] = useState(true);
  const copy = noticeCopy[kind];

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-6" role="dialog" aria-modal="true" aria-labelledby="verification-notice-title">
      <button type="button" onClick={() => setIsOpen(false)} aria-label="Fechar aviso" className="absolute inset-0 bg-[#1e211d]/55" />
      <div className="relative w-full max-w-md bg-[#f8f5ee] px-7 py-8 shadow-2xl sm:px-10">
        <button type="button" onClick={() => setIsOpen(false)} aria-label="Fechar aviso" className="absolute right-5 top-4 text-2xl font-light leading-none text-[#65685f] hover:text-[#1e211d]">×</button>
        <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#8e5b3c]">ColorKit · Meu álbum</p>
        <h2 id="verification-notice-title" className="font-serif text-4xl leading-none tracking-[-0.04em]">{copy.title}</h2>
        <p className="mt-5 text-sm leading-6 text-[#65685f]">{copy.body}</p>
        <button type="button" onClick={() => setIsOpen(false)} className="mt-7 w-full bg-[#1e211d] px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f8f5ee] hover:bg-[#8e5b3c]">Entendi</button>
      </div>
    </div>
  );
}

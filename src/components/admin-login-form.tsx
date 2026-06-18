"use client";

import { useState, useTransition } from "react";
import { loginAdmin } from "@/app/admin/actions";

export function AdminLoginForm() {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await loginAdmin(formData);
          if (result) {
            setMessage(result.message);
          }
        });
      }}
      className="rounded-2xl border border-[#e8d8cc] bg-white px-6 py-7 shadow-lg shadow-[#c4a08630]"
    >
      <h1 className="font-serif text-2xl text-[#9f5f4d]">Área dos noivos</h1>
      <p className="mt-2 text-sm leading-6 text-[#7a6a61]">
        Digite a senha para ver as fotos enviadas para Davi e Mirna.
      </p>

      <label className="mt-6 block">
        <span className="text-sm font-semibold text-[#3a302a]">Senha</span>
        <input
          name="password"
          type="password"
          className="mt-2 w-full rounded-xl border border-[#d9c2b1] bg-[#fdfaf7] px-4 py-3.5 text-base text-[#1e1a18] outline-none transition focus:border-[#a76554] focus:ring-4 focus:ring-[#eacdc4]/50"
          autoFocus
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="mt-5 w-full rounded-xl bg-[#2f2925] px-5 py-4 text-base font-semibold text-white transition hover:bg-[#4a3d35] disabled:opacity-50"
      >
        {isPending ? "Entrando..." : "Entrar"}
      </button>

      {message && (
        <p className="mt-4 rounded-xl bg-[#f7eadf] px-4 py-3 text-sm text-[#5d493f]">
          {message}
        </p>
      )}
    </form>
  );
}

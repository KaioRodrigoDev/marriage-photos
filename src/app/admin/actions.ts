"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getStorageTarget,
  isRemoteStorageConfigured,
  setActiveStorageTargetKey,
  type StorageTargetKey,
} from "@/lib/storage";

const cookieName = "wedding-admin";

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return { ok: false, message: "Senha incorreta." };
  }

  const cookieStore = await cookies();
  cookieStore.set(cookieName, "authorized", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 12,
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
  redirect("/admin");
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(cookieName)?.value === "authorized";
}

export async function setActiveStorageTarget(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    return {
      ok: false,
      message: "Sessao expirada. Entre novamente para alterar a VPS.",
    };
  }

  const targetKey = String(formData.get("target") ?? "");
  const switchPassword = String(formData.get("switchPassword") ?? "");

  if (
    !process.env.STORAGE_SWITCH_PASSWORD ||
    switchPassword !== process.env.STORAGE_SWITCH_PASSWORD
  ) {
    return { ok: false, message: "Senha de troca incorreta." };
  }

  if (targetKey !== "oracle" && targetKey !== "contabo") {
    return { ok: false, message: "VPS invalida." };
  }

  const target = getStorageTarget(targetKey);

  if (!target || !isRemoteStorageConfigured(target)) {
    return {
      ok: false,
      message: "Essa VPS ainda nao esta configurada nas variaveis de ambiente.",
    };
  }

  await setActiveStorageTargetKey(targetKey as StorageTargetKey);
  revalidatePath("/admin");

  return {
    ok: true,
    message: `Uploads novos serao salvos em ${target.label}.`,
  };
}

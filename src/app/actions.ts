"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { findOrCreatePerson, normalizeName } from "@/lib/people";
import { savePhoto } from "@/lib/storage";
import { buildPixPayload, newTransactionId } from "@/lib/pix";

const maxFileSize = 10 * 1024 * 1024;

export async function generatePix(formData: FormData) {
  const senderName = normalizeName(String(formData.get("senderName") ?? ""));
  const rawAmount = String(formData.get("amount") ?? "").replace(",", ".");
  const amount = Number.parseFloat(rawAmount);

  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false as const, message: "Informe um valor valido para o Pix." };
  }

  // Pix aceita no maximo 2 casas decimais.
  const normalizedAmount = Math.round(amount * 100) / 100;
  const amountInCents = Math.round(normalizedAmount * 100);

  try {
    const transactionId = newTransactionId();
    const code = buildPixPayload(normalizedAmount, transactionId);

    await prisma.pixGeneration.create({
      data: {
        senderName: senderName || null,
        amount: amountInCents,
        transactionId,
        payload: code,
      },
    });

    revalidatePath("/admin");

    return {
      ok: true as const,
      message: "Codigo Pix gerado.",
      code,
      amount: normalizedAmount,
    };
  } catch (error) {
    console.error("Pix generation failed", error);
    return {
      ok: false as const,
      message: "Nao foi possivel gerar o Pix agora. Tente novamente.",
    };
  }
}

export async function searchPeople(query: string) {
  const normalizedQuery = normalizeName(query);

  if (!normalizedQuery) {
    return [];
  }

  try {
    return await prisma.person.findMany({
      where: {
        name: {
          contains: normalizedQuery,
        },
      },
      orderBy: { name: "asc" },
      take: 8,
      select: {
        id: true,
        name: true,
      },
    });
  } catch (error) {
    console.error("People search failed", error);
    return [];
  }
}

export async function submitGift(formData: FormData) {
  const senderName = String(formData.get("senderName") ?? "");
  const message = normalizeName(String(formData.get("message") ?? ""));
  const rawTaggedNames = formData.getAll("taggedNames").map(String);
  const files = formData
    .getAll("photos")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (!normalizeName(senderName)) {
    return { ok: false, message: "Informe seu nome para enviar as fotos." };
  }

  if (files.length === 0) {
    return { ok: false, message: "Escolha pelo menos uma foto." };
  }

  const invalidFile = files.find(
    (file) => !file.type.startsWith("image/") || file.size > maxFileSize,
  );

  if (invalidFile) {
    return {
      ok: false,
      message: "Envie apenas imagens de ate 10 MB cada.",
    };
  }

  try {
    const sender = await findOrCreatePerson(senderName);
    const taggedPeople = await Promise.all(
      Array.from(new Set(rawTaggedNames.map(normalizeName).filter(Boolean)))
        .filter((name) => name !== sender.name)
        .map(findOrCreatePerson),
    );

    for (const file of files) {
      const savedPhoto = await savePhoto(file);

      await prisma.photoGift.create({
        data: {
          senderId: sender.id,
          fileName: savedPhoto.fileName,
          originalName: file.name,
          url: savedPhoto.url,
          storageTarget: savedPhoto.storageTarget,
          mimeType: file.type,
          size: file.size,
          message: message || null,
          tags: {
            create: taggedPeople.map((person) => ({
              personId: person.id,
            })),
          },
        },
      });
    }
  } catch (error) {
    console.error("Gift submission failed", error);
    return {
      ok: false,
      message:
        "Nao foi possivel salvar as fotos agora. Verifique a conexao com o banco e tente novamente.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");

  return {
    ok: true,
    message: "Fotos enviadas. Obrigado por presentear Davi e Mirna!",
  };
}

import { prisma } from "@/lib/prisma";

export function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

export async function findOrCreatePerson(name: string) {
  const normalizedName = normalizeName(name);

  if (!normalizedName) {
    throw new Error("Nome vazio.");
  }

  return prisma.person.upsert({
    where: { name: normalizedName },
    create: { name: normalizedName },
    update: {},
  });
}

import { GiftForm } from "@/components/gift-form";

export default function Home() {
  return (
    <main className="min-h-svh bg-[#faf5f0]">
      <div className="mx-auto w-full max-w-md px-5 pb-20 pt-16 sm:px-8 sm:pt-24">

        <header className="mb-12 text-center">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[#b08870]">
            Álbum dos noivos
          </p>
          <h1 className="mt-4 font-serif text-[2rem] leading-tight text-[#9f5f4d] sm:text-[2.25rem]">
            Davi e Mirna
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#7a6a61]">
            Obrigado por celebrar com a gente. Envie suas fotos para presentear
            os noivos com as lembranças desse dia.
          </p>
        </header>

        <GiftForm />
      </div>
    </main>
  );
}

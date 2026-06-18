"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type AdminPersonFilter = {
  id: string;
  name: string;
  sentCount: number;
  taggedCount: number;
};

type AdminPhotoFiltersProps = {
  people: AdminPersonFilter[];
  selectedSenderId?: string;
  selectedTaggedIds: string[];
};

export function AdminPhotoFilters({
  people,
  selectedSenderId,
  selectedTaggedIds,
}: AdminPhotoFiltersProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  const selectedTaggedSet = useMemo(
    () => new Set(selectedTaggedIds),
    [selectedTaggedIds],
  );

  const filteredPeople = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return people;
    }

    return people.filter((person) =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [people, query]);

  function updateFilters(update: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    update(params);
    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }

  function toggleSender(personId: string) {
    updateFilters((params) => {
      if (selectedSenderId === personId) {
        params.delete("sender");
      } else {
        params.set("sender", personId);
      }
    });
  }

  function toggleTagged(personId: string) {
    updateFilters((params) => {
      const nextSelected = new Set(selectedTaggedIds);

      if (nextSelected.has(personId)) {
        nextSelected.delete(personId);
      } else {
        nextSelected.add(personId);
      }

      params.delete("people");
      Array.from(nextSelected).forEach((id) => params.append("people", id));
    });
  }

  function clearFilters() {
    updateFilters((params) => {
      params.delete("sender");
      params.delete("people");
    });
  }

  const hasActiveFilters = Boolean(selectedSenderId || selectedTaggedIds.length);

  return (
    <aside className="rounded-2xl border border-[#e8d8cc] bg-white p-4 shadow-lg shadow-[#c4a08620] lg:sticky lg:top-8 lg:max-h-[calc(100svh-4rem)] lg:overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl text-[#9f5f4d]">Convidados</h2>
          <p className="mt-1 text-xs text-[#8f7c71]">
            Filtre por quem enviou ou aparece na foto.
          </p>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="shrink-0 rounded-lg border border-[#d9c2b1] px-2.5 py-1.5 text-xs font-semibold text-[#5d493f] transition hover:border-[#a76554]"
          >
            Limpar
          </button>
        )}
      </div>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar convidado"
        className="mt-4 w-full rounded-xl border border-[#d9c2b1] bg-[#fdfaf7] px-3.5 py-2.5 text-sm text-[#1e1a18] outline-none placeholder:text-[#b0a098] transition focus:border-[#a76554] focus:ring-4 focus:ring-[#eacdc4]/50"
      />

      <div className="mt-4 grid grid-cols-2 gap-2 text-[0.68rem] font-semibold uppercase text-[#9a8880]">
        <span>Enviou</span>
        <span>Aparece</span>
      </div>

      <div className="mt-2 space-y-2 lg:max-h-[calc(100svh-15rem)] lg:overflow-y-auto lg:pr-1">
        {filteredPeople.length === 0 ? (
          <p className="rounded-xl bg-[#fdfaf7] px-3 py-4 text-sm text-[#806c60]">
            Nenhum convidado encontrado.
          </p>
        ) : (
          filteredPeople.map((person) => {
            const isSenderSelected = selectedSenderId === person.id;
            const isTaggedSelected = selectedTaggedSet.has(person.id);

            return (
              <div
                key={person.id}
                className="rounded-xl border border-[#ead8cc] bg-[#fdfaf7] p-3"
              >
                <p className="truncate text-sm font-semibold text-[#2f2925]">
                  {person.name}
                </p>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <FilterButton
                    active={isSenderSelected}
                    count={person.sentCount}
                    label="Enviou"
                    onClick={() => toggleSender(person.id)}
                  />
                  <FilterButton
                    active={isTaggedSelected}
                    count={person.taggedCount}
                    label="Aparece"
                    onClick={() => toggleTagged(person.id)}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

function FilterButton({
  active,
  count,
  label,
  onClick,
}: {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "min-h-9 rounded-lg border px-2 py-1.5 text-xs font-semibold transition active:scale-[0.98]",
        active
          ? "border-[#9f5f4d] bg-[#9f5f4d] text-white"
          : "border-[#d9c2b1] bg-white text-[#5d493f] hover:border-[#a76554]",
      ].join(" ")}
      aria-pressed={active}
    >
      <span className="block truncate">{label}</span>
      <span className={active ? "text-white/80" : "text-[#9a8880]"}>
        {count}
      </span>
    </button>
  );
}

"use client";

import { useState, useTransition } from "react";
import { setActiveStorageTarget } from "@/app/admin/actions";
import type {
  StorageDiskStatus,
  StorageTargetConfig,
  StorageTargetKey,
} from "@/lib/storage";

type StoragePanelTarget = Pick<StorageTargetConfig, "key" | "label" | "host" | "uploadPath" | "publicBaseUrl"> & {
  configured: boolean;
  status: StorageDiskStatus;
};

type DeveloperStoragePanelProps = {
  activeTargetKey: StorageTargetKey;
  targets: StoragePanelTarget[];
};

export function DeveloperStoragePanel({
  activeTargetKey,
  targets,
}: DeveloperStoragePanelProps) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <section className="mb-8 rounded-2xl border border-[#e8d8cc] bg-white p-4 shadow-lg shadow-[#c4a08620] sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#b08870]">
            Desenvolvedor
          </p>
          <h2 className="mt-2 font-serif text-2xl text-[#9f5f4d]">
            Storage das fotos
          </h2>
        </div>
        <p className="text-sm text-[#7a6a61]">
          Destino ativo:{" "}
          <strong className="font-semibold text-[#2f2925]">
            {targets.find((target) => target.key === activeTargetKey)?.label}
          </strong>
        </p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {targets.map((target) => {
          const isActive = target.key === activeTargetKey;

          return (
            <article
              key={target.key}
              className={[
                "rounded-xl border p-4",
                isActive
                  ? "border-[#9f5f4d] bg-[#fff8f4]"
                  : "border-[#ead8cc] bg-[#fdfaf7]",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-[#2f2925]">{target.label}</h3>
                  <p className="mt-1 truncate text-xs text-[#8f7c71]">
                    {target.host ?? "Host nao configurado"}
                  </p>
                </div>
                <span
                  className={[
                    "rounded-full px-2.5 py-1 text-xs font-semibold",
                    isActive
                      ? "bg-[#9f5f4d] text-white"
                      : "bg-white text-[#8f7c71]",
                  ].join(" ")}
                >
                  {isActive ? "Ativa" : "Reserva"}
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <Metric label="Livre" value={target.status.available ?? "-"} />
                <Metric label="Uso" value={target.status.usePercent ?? "-"} />
                <Metric label="Total" value={target.status.total ?? "-"} />
                <Metric label="Uploads" value={target.status.uploadSize ?? "-"} />
              </dl>

              <div className="mt-4 space-y-1 text-xs text-[#8f7c71]">
                <p className="truncate">Pasta: {target.uploadPath ?? "-"}</p>
                <p className="truncate">URL: {target.publicBaseUrl ?? "-"}</p>
              </div>

              {!target.status.ok && (
                <p className="mt-3 rounded-lg bg-[#f7eadf] px-3 py-2 text-xs text-[#5d493f]">
                  {target.status.error}
                </p>
              )}

              <form
                action={(formData) => {
                  setMessage("");
                  startTransition(async () => {
                    const result = await setActiveStorageTarget(formData);
                    setMessage(result.message);
                  });
                }}
                className="mt-4 space-y-2"
              >
                <input type="hidden" name="target" value={target.key} />
                <input
                  name="switchPassword"
                  type="password"
                  placeholder="Senha para trocar"
                  autoComplete="off"
                  disabled={isActive || isPending || !target.configured}
                  className="w-full rounded-xl border border-[#d9c2b1] bg-white px-3.5 py-2.5 text-sm text-[#1e1a18] outline-none placeholder:text-[#b0a098] transition focus:border-[#a76554] focus:ring-4 focus:ring-[#eacdc4]/50 disabled:cursor-not-allowed disabled:opacity-45"
                />
                <button
                  disabled={isActive || isPending || !target.configured}
                  className="w-full rounded-xl bg-[#2f2925] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4a3d35] disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Usar esta VPS
                </button>
              </form>
            </article>
          );
        })}
      </div>

      {message && (
        <p className="mt-4 rounded-xl bg-[#f7eadf] px-4 py-3 text-sm text-[#5d493f]">
          {message}
        </p>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white px-3 py-2">
      <dt className="text-[0.68rem] font-semibold uppercase text-[#9a8880]">
        {label}
      </dt>
      <dd className="mt-1 font-semibold text-[#2f2925]">{value}</dd>
    </div>
  );
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ssh2 / ssh2-sftp-client tem binarios nativos (.node) e modulos nao-ESM que
  // o Turbopack nao consegue empacotar. Mantem como dependencias externas do
  // servidor para serem carregadas em runtime via require.
  serverExternalPackages: ["ssh2", "ssh2-sftp-client"],
};

export default nextConfig;

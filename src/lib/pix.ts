import { randomBytes } from "node:crypto";
import { payload } from "pix-payload";

// O Pix limita o nome do recebedor a 25 caracteres e a cidade a 15.
function clean(value: string, max: number) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove acentos
    .replace(/[^ -~]/g, "") // remove caracteres nao-ASCII
    .trim()
    .slice(0, max);
}

export function getPixConfig() {
  const key = process.env.PIX_KEY;

  if (!key) {
    throw new Error("PIX_KEY nao configurada no ambiente.");
  }

  return {
    key,
    name: clean(process.env.PIX_RECEIVER_NAME ?? "Noivos", 25),
    city: clean(process.env.PIX_RECEIVER_CITY ?? "Brasil", 15),
  };
}

// transactionId do Pix: ate 25 caracteres alfanumericos.
export function newTransactionId() {
  return randomBytes(13).toString("hex").slice(0, 25).toUpperCase();
}

// CRC16/CCITT-FALSE (poly 0x1021, init 0xFFFF) exigido pelo padrao EMV do Pix.
function crc16(data: string) {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

// A lib pix-payload tem um bug: nao faz zero-pad do CRC (emite "6303B3B" em vez
// de "63040B3B"), gerando um codigo invalido. Recomputamos o campo CRC (ID 63).
function fixCrc(raw: string) {
  const body = raw.replace(/63\d{2}[0-9A-Fa-f]+$/, "") + "6304";
  return body + crc16(body);
}

export function buildPixPayload(amountInReais: number, transactionId: string) {
  const { key, name, city } = getPixConfig();

  const raw = payload({
    key,
    name,
    city,
    amount: amountInReais,
    transactionId,
  });

  return fixCrc(raw);
}

import crypto from 'crypto';

export function generateLotHash(lotId: string, collectorId: string, weightKg: number, timestamp: string) {
  const input = `${lotId}|${collectorId}|${weightKg}|${timestamp}`;
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function shortenHash(hash: string) {
  if (hash.length <= 16) return hash;
  return hash.substring(0, 10) + "..." + hash.substring(hash.length - 6);
}

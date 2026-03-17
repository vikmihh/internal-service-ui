import SparkMD5 from 'spark-md5';

export function buildApiKeyFingerprint(publicKey: string): string {
  const parts = publicKey.trim().split(/\s+/);
  if (parts.length < 2) {
    throw new Error('Invalid SSH key format.');
  }

  const base64Body = parts[1];
  if (!/^[A-Za-z0-9+/=]+$/.test(base64Body)) {
    throw new Error('Invalid SSH key body.');
  }

  const raw = Uint8Array.from(atob(base64Body), (char) => char.charCodeAt(0));
  const digest = SparkMD5.ArrayBuffer.hash(raw.buffer);

  return digest.match(/.{1,2}/g)?.join(':') ?? '';
}

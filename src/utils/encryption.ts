
export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
};

export const arrayBufferToBase64ForImg = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 8192;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }

  return btoa(binary);
};

export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

export const generateKeyPair = async () => {
  return await window.crypto.subtle.generateKey(
    {
      name: 'ECDH',
      namedCurve: 'P-256'
    },
    true,
    ['deriveKey']
  );
};

export const deriveSharedSecret = async (
  privateKey: CryptoKey,
  publicKey: CryptoKey
): Promise<CryptoKey> => {
  return await window.crypto.subtle.deriveKey(
    {
      name: 'ECDH',
      public: publicKey
    },
    privateKey,
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  );
};

export const encryptMessage = async (
  message: string,
  sharedSecret: CryptoKey,
  isImage: Boolean = false
): Promise<string> => {
  const encoder = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    sharedSecret,
    encoder.encode(message)
  );

  const payload = {
    ciphertext: isImage ? arrayBufferToBase64ForImg(ciphertext) : arrayBufferToBase64(ciphertext),
    iv: arrayBufferToBase64(iv)
  };

  return JSON.stringify(payload);
};

export const decryptMessage = async (
  encryptedMessage: string,
  sharedSecret: CryptoKey
): Promise<string> => {
  const decoder = new TextDecoder();
  const payload = JSON.parse(encryptedMessage);

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: base64ToArrayBuffer(payload.iv)
    },
    sharedSecret,
    base64ToArrayBuffer(payload.ciphertext)
  );

  return decoder.decode(decrypted);
};

export const exportPublicKey = async (key: CryptoKey): Promise<string> => {
  const exported = await window.crypto.subtle.exportKey('raw', key);
  return arrayBufferToBase64(exported);
};

export const importPublicKey = async (key: string): Promise<CryptoKey> => {
  const keyBuffer = base64ToArrayBuffer(key);
  return await window.crypto.subtle.importKey(
    'raw',
    keyBuffer,
    {
      name: 'ECDH',
      namedCurve: 'P-256'
    },
    true,
    []
  );
};

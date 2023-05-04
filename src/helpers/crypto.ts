import { createSign, createVerify, generateKeyPairSync } from 'node:crypto';

function generateKeys() {
  // const { generateKeyPairSync } = await import('node:crypto')
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });
  return [publicKey, privateKey] as const;
}

function signMessage(message: string, privateKey: string) {
  const signer = createSign('rsa-sha256');
  signer.update(message);
  const signature = signer.sign(privateKey, 'hex');
  return signature;
}

function verifyMessageSignature(message: string, publicKey: string, signature: string) {
  const verifier = createVerify('rsa-sha256');
  verifier.update(message);
  const isVerified = verifier.verify(publicKey, signature, 'hex');
  return isVerified;
}

export { generateKeys, signMessage, verifyMessageSignature };

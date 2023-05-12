import { createPublicKey, createSign, createVerify, generateKeyPairSync } from 'crypto';

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
  const signature = signer.sign(privateKey, 'base64');
  return signature;
}

function verifyMessageSignature(message: string, publicKey: string, signature: string) {
  const key = createPublicKey(publicKey); // !?!?!?!?!?!?!?!?!?!?!?!?!?!
  const verifier = createVerify('rsa-sha256');
  verifier.update(message);
  const isVerified = verifier.verify(key, signature, 'base64');
  return isVerified;
}

export { generateKeys, signMessage, verifyMessageSignature };

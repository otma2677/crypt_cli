/**
 *
 */
import {
  scryptSync,
  timingSafeEqual,
  randomBytes,
  createCipheriv,
  createDecipheriv
} from 'node:crypto';

/**
 *
 */
export function cipherGCM(content, password) {
  const bufferedContent = Buffer.from(content, 'utf-8');
  const bufferedPassword = Buffer.from(password, 'hex');
  const bufferedVector = randomBytes(12);

  const cipher = createCipheriv('aes-256-gcm', bufferedPassword, bufferedVector);
  const update = cipher.update(bufferedContent);
  const final = Buffer.concat([
    update,
    cipher.final()
  ]);

  return {
    vector: bufferedVector.toString('hex'),
    cipher: final.toString('hex'),
    tag: cipher.getAuthTag().toString('hex')
  };
}

export function decipherGCM(cipher, password, vector, tag) {
  const bufferedPassword = Buffer.from(password, 'hex');
  const bufferedContent = Buffer.from(cipher, 'hex');
  const bufferedVector = Buffer.from(vector, 'hex');
  const bufferedTag = Buffer.from(tag, 'hex');

  const decipher = createDecipheriv('aes-256-gcm', bufferedPassword, bufferedVector);
  decipher.setAuthTag(bufferedTag);
  const update = decipher.update(bufferedContent);

  return Buffer.concat([
    update,
    decipher.final()
  ]).toString('utf-8');
}

/**
 *
 */
export function generatePassword(password, salt) {
  const bufferedPassword = Buffer.from(password);
  const bufferedSalt = salt ? Buffer.from(salt, 'hex') : randomBytes(32);

  const N = Math.pow(2, 17);
  const r = 8;
  const p = 1;
  const options = {
    N,
    r,
    p,
    maxmem: (128 * p * r) + (128 * (2 + N) * r)
  };

  const hashedPassword = scryptSync(
    bufferedPassword,
    bufferedSalt,
    32,
    options
  );

  return {
    pass: hashedPassword.toString('hex'),
    salt: bufferedSalt.toString('hex')
  };
}

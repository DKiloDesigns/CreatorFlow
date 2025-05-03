import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // AES-GCM uses a 16-byte IV
const KEY_LENGTH = 32; // AES-256 requires a 32-byte key

// Retrieve the encryption key from environment variables
// Ensure this is a 32-byte (64 hex characters) secure random key
const ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY;

if (!ENCRYPTION_KEY || Buffer.from(ENCRYPTION_KEY, 'hex').length !== KEY_LENGTH) {
  throw new Error(
    'Invalid TOKEN_ENCRYPTION_KEY. Please set a 64-character hex key in .env'
  );
}

const key = Buffer.from(ENCRYPTION_KEY, 'hex');

/**
 * Encrypts a plain text token using AES-256-GCM.
 * @param text The plain text token to encrypt.
 * @returns The encrypted token as a string (iv:authTag:encryptedData), hex encoded.
 * Returns null if encryption fails.
 */
export function encryptToken(text: string): string | null {
  if (!text) return null;
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([
      cipher.update(text, 'utf8'),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    // Combine IV, authTag, and encrypted data, then hex encode
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
  } catch (error) {
    console.error('Encryption failed:', error);
    return null;
  }
}

/**
 * Decrypts an encrypted token string (iv:authTag:encryptedData) using AES-256-GCM.
 * @param encryptedText The hex-encoded encrypted token string.
 * @returns The decrypted plain text token, or null if decryption fails or input is invalid.
 */
export function decryptToken(encryptedText: string): string | null {
  if (!encryptedText) return null;
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      console.error('Invalid encrypted text format');
      return null;
    }

    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encryptedData = Buffer.from(parts[2], 'hex');

    if (iv.length !== IV_LENGTH) {
      console.error('Invalid IV length during decryption');
      return null;
    }

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  } catch (error) {
    console.error('Decryption failed:', error); // Might fail if key is wrong or data tampered
    return null;
  }
} 
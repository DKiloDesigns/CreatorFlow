import crypto from 'crypto';

// IMPORTANT: Use a strong, securely managed key stored in environment variables!
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; 
// Must be 32 characters (256 bits) for AES-256
const IV_LENGTH = 16; // For AES, this is always 16

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    console.error('FATAL: ENCRYPTION_KEY environment variable is missing or not 32 characters long.');
    // In a real app, you might throw an error here to prevent startup without a valid key,
    // especially if encryption is critical.
    // throw new Error('Invalid ENCRYPTION_KEY configuration.');
}

/**
 * Encrypts a text string using AES-256-CBC.
 * @param text The text to encrypt.
 * @returns Encrypted text in format 'iv:encryptedData' (hex encoded), or null if encryption fails or key is missing.
 */
export function encrypt(text: string): string | null {
    if (!ENCRYPTION_KEY) {
        console.error('Encryption failed: ENCRYPTION_KEY is not available.');
        return null;
    }
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (error) {
        console.error('Encryption error:', error);
        return null;
    }
}

/**
 * Decrypts an AES-256-CBC encrypted string.
 * @param text Encrypted text in format 'iv:encryptedData' (hex encoded).
 * @returns The original decrypted text, or null if decryption fails or key is missing.
 */
export function decrypt(text: string): string | null {
    if (!ENCRYPTION_KEY) {
        console.error('Decryption failed: ENCRYPTION_KEY is not available.');
        return null;
    }
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift()!, 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error('Decryption error:', error);
        return null; // Return null or throw? Consider error handling strategy.
    }
}

// // Simple Placeholder versions (use if node crypto is unavailable or for quick testing):
// // WARNING: These are NOT secure and only for placeholder purposes.
// export function encrypt(text: string): string | null {
//     console.warn("[Crypto Placeholder] Encrypting text (NOT SECURE):", text);
//     return `encrypted_${Buffer.from(text).toString('base64')}`;
// }

// export function decrypt(text: string): string | null {
//     console.warn("[Crypto Placeholder] Decrypting text (NOT SECURE):", text);
//     if (text?.startsWith('encrypted_')) {
//         try {
//             return Buffer.from(text.substring(10), 'base64').toString('utf-8');
//         } catch (e) {
//             return null;
//         }
//     } 
//     return null; // Indicate decryption failed
// } 
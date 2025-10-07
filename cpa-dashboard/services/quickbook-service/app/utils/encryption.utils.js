import crypto from 'crypto';
import { ENCRYPTION_DEFAULTS } from './constants/config.constants.js';
import { ENCRYPTION_ERROR_MESSAGES } from './constants/error.constants.js';


/**
 * Simple encrypt function for backward compatibility
 * @param {string} data - Data to encrypt
 * @returns {Promise<string>} Encrypted data
 */
export const encrypt = async (data) => {
  try {
    const key = process.env.ENCRYPTION_KEY ? process.env.ENCRYPTION_KEY : generateEncryptionKey();
    const result = encryptData(data, key);
    return result.encrypted;
  } catch {
    throw new Error(ENCRYPTION_ERROR_MESSAGES.ENCRYPTION_FAILED);
  }
};

/**
 * Simple decrypt function for backward compatibility
 * @param {string} encryptedData - Encrypted data
 * @returns {Promise<string>} Decrypted data
 */
export const decrypt = async (encryptedData) => {
  try {
    const key = process.env.ENCRYPTION_KEY ? process.env.ENCRYPTION_KEY : generateEncryptionKey();
    // For simple decryption, we'll use a basic approach
    const decipher = crypto.createDecipher(ENCRYPTION_DEFAULTS.ALGORITHM, key);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    throw new Error(ENCRYPTION_ERROR_MESSAGES.DECRYPTION_FAILED);
  }
};

export default {
  encrypt,
  decrypt
};

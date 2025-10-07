import { getQuickbooksConfig, validateRequiredEnvVars } from './shared.config.js';
import { CONFIG_DEFAULTS, CONFIG_VALIDATION, ENCRYPTION_MESSAGES } from '../app/utils/constants/config.constants.js';

/**
 * QuickBooks Configuration
 * Validates and exports QuickBooks environment variables
 */
export const quickbooksConfig = getQuickbooksConfig();
/**
 * Validate QuickBooks configuration
 * @returns {Object} Validation result
 */
export const validateQuickbooksConfig = () => {
  try {
    validateRequiredEnvVars(CONFIG_VALIDATION.REQUIRED_QUICKBOOKS_VARS, 'QuickBooks Configuration');
    
    if (quickbooksConfig.encryptionKey && quickbooksConfig.encryptionKey.length < CONFIG_VALIDATION.ENCRYPTION_KEY_MIN_LENGTH) {
      throw new Error(`${ENCRYPTION_MESSAGES.KEY_MISSING} must be at least ${CONFIG_VALIDATION.ENCRYPTION_KEY_MIN_LENGTH} characters long`);
    }
    
    return {
      isValid: true,
      config: quickbooksConfig
    };
  } catch (error) {
    return {
      isValid: false,
      error: error.message,
      config: quickbooksConfig
    };
  }
};
/**
 * Get QuickBooks OAuth URL
 * @param {string} state - Optional state parameter
 * @returns {string} OAuth URL
 */
export const getQuickbooksOAuthUrl = (state = '') => {
  const params = new URLSearchParams({
    client_id: quickbooksConfig.clientId,
    redirect_uri: quickbooksConfig.redirectUri,
    response_type: CONFIG_DEFAULTS.QUICKBOOKS_RESPONSE_TYPE,
    scope: quickbooksConfig.scopes,
    state: state,
  });
  return `${quickbooksConfig.oauthBaseUrl}?${params.toString()}`;
};

/**
 * Get QuickBooks API URL
 * @param {string} endpoint - API endpoint
 * @returns {string} Full API URL
 */
export const getQuickbooksApiUrl = (endpoint = '') => {
  // Use production URL only
  const baseUrl = quickbooksConfig.baseUrl;
  const fullUrl = `${baseUrl}/${quickbooksConfig.apiVersion}/${endpoint}`;
  
  console.log('🔧 QuickBooks Production URL:', {
    environment: quickbooksConfig.environment,
    productionUrl: baseUrl,
    fullUrl: fullUrl
  });
  
  return fullUrl;
};
export default quickbooksConfig;

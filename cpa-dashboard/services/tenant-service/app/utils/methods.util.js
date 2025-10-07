/**
 * Throw an error with a given message and code
 * @param {string} message - Error message
 * @param {string} code - Error code
 */
export const throwError=(message, code)=>{
  const error = new Error(message);
  error.code = code;
  throw error;
}
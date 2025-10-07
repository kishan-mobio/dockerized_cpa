import { ERROR_DEFAULT_MESSAGES, RESPONSE_FIELDS } from "./constants.util.js";

/**
 * Success Response
 *
 * @param {*} msg
 * @param {*} data
 * @returns
 */
export const successResponse = (msg, data) => {
  return {
    [RESPONSE_FIELDS.STATUS]: true,
    [RESPONSE_FIELDS.MESSAGE]: msg,
    [RESPONSE_FIELDS.DATA]: data,
  };
};

/**
 * Error Response
 *
 * @param {*} msg
 * @param {*} data
 * @returns
 */
export const errorResponse = (msg, data) => {
  return {
    [RESPONSE_FIELDS.STATUS]: false,
    [RESPONSE_FIELDS.MESSAGE]:
      msg || ERROR_DEFAULT_MESSAGES.SOMETHING_WENT_WRONG,
    [RESPONSE_FIELDS.DATA]: data,
  };
};

export const throwCustomErrorWithStatus = (msg, status) => {
  const error = new Error(msg);
  error.statusCode = status;
  throw error;
};

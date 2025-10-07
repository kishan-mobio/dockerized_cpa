import { body } from "express-validator";
import {
  VALIDATION_MESSAGES,
  MODEL_FIELDS,
  VALIDATION_RULES,
} from "../utils/constants.util.js";

/**
 * Validation rules for request key endpoint
 */
const requestKey = [
  body(MODEL_FIELDS.APP_ID)
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.APP_ID_REQUIRED)
    .isLength({
      min: VALIDATION_RULES.APP_ID_MIN_LENGTH,
      max: VALIDATION_RULES.APP_ID_MAX_LENGTH,
    })
    .withMessage(VALIDATION_MESSAGES.APP_ID_LENGTH)
    .trim(),

  body(MODEL_FIELDS.APP_KEY)
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.APP_KEY_REQUIRED)
    .isLength({
      min: VALIDATION_RULES.APP_KEY_MIN_LENGTH,
      max: VALIDATION_RULES.APP_KEY_MAX_LENGTH,
    })
    .withMessage(VALIDATION_MESSAGES.APP_KEY_LENGTH)
    .trim(),
];

export default {
  requestKey,
};

import Joi from "joi";
import { COMMON_MESSAGES } from "../utils/constants/error.constants.js";
import { REPORT_CONSTANTS } from "../utils/constants/reports.constants.js";

// Base schema with common fields
const baseReportSchema = Joi.object({
  startDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "startDate must be in YYYY-MM-DD format",
      "any.required": "startDate is required",
    }),
  endDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "endDate must be in YYYY-MM-DD format",
      "any.required": "endDate is required",
    }),
  quickBookAccesstoken: Joi.string().required().messages({
    "any.required": "quickBookAccesstoken is required",
  }),
  realmId: Joi.string().required().messages({
    "any.required": "realmId is required",
  }),
});

// Common validation function
const addCommonValidation = (
  schema,
  includeFutureDateCheck = true,
  includeDateRangeCheck = true
) => {
  return schema
    .custom((value, helpers) => {
      const startDate = new Date(value.startDate);
      const endDate = new Date(value.endDate);
      const today = new Date();

      // Check if start date is before end date
      if (startDate >= endDate) {
        return helpers.error("custom.dateRange");
      }

      // Check if date range exceeds 1 year (if enabled)
      if (includeDateRangeCheck) {
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > REPORT_CONSTANTS.DATE_VALIDATION.MAX_DAYS_IN_YEAR) {
          return helpers.error("custom.dateRangeExceed");
        }
      }

      // Check if dates are not in the future (if enabled)
      if (includeFutureDateCheck) {
        if (startDate > today || endDate > today) {
          return helpers.error("custom.futureDate");
        }
      }

      return value;
    })
    .messages({
      "custom.dateRange": COMMON_MESSAGES.START_DATE_BEFORE_END_DATE,
      "custom.dateRangeExceed": COMMON_MESSAGES.DATE_RANGE_EXCEED_ONE_YEAR,
      "custom.futureDate": COMMON_MESSAGES.DATE_CANNOT_BE_FUTURE,
    });
};

// Report-specific schemas
export const trialBalanceSchema = addCommonValidation(
  baseReportSchema,
  true,
  true
);
export const profitLossSchema = addCommonValidation(
  baseReportSchema,
  false,
  false
);
export const balanceSheetSchema = addCommonValidation(
  baseReportSchema,
  true,
  false  // Temporarily disable date range validation for testing
);
export const cashFlowSchema = addCommonValidation(baseReportSchema, true, true);
export const generalReportSchema = addCommonValidation(
  baseReportSchema,
  true,
  true
);

// Export all schemas
export const reportSchemas = {
  trialBalance: trialBalanceSchema,
  profitLoss: profitLossSchema,
  balanceSheet: balanceSheetSchema,
  cashFlow: cashFlowSchema,
  general: generalReportSchema,
};

export default reportSchemas;

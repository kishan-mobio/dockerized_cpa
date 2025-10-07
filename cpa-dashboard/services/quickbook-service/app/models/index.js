import sequelize from "../../config/postgres.config.js";
import GLAccountMasterModel from "./gl_account_master.model.js";
import QuickbookAccountModel from "./quickbook_account.model.js";
import TrialBalanceModels from "./trial_balance.model.js";
import ProfitLossModels from "./profit_loss.model.js";
import BalanceSheetModels from "./balance_sheet.model.js";
import CashFlowModels from "./cash_flow.model.js";

const models = {
  gl_account_master: GLAccountMasterModel(sequelize),
  quickbook_account: QuickbookAccountModel(sequelize),
  ...TrialBalanceModels(sequelize),
  ...ProfitLossModels(sequelize),
  ...BalanceSheetModels(sequelize),
  ...CashFlowModels(sequelize),
};

// Note: Removed gl_account_id associations as these tables don't have gl_account_id columns
// The reports are associated with realm_id instead

if (models.TrialBalanceReport) {
  models.TrialBalanceReport.hasMany(models.TrialBalanceColumn, {
    foreignKey: "report_id",
    as: "columns",
  });

  models.TrialBalanceReport.hasMany(models.TrialBalanceRow, {
    foreignKey: "report_id",
    as: "rows",
  });
}

if (models.PnLReport) {
  models.PnLReport.hasMany(models.PnLLine, {
    foreignKey: "report_id",
    as: "lines",
  });

  models.PnLReport.hasMany(models.PnLSummary, {
    foreignKey: "report_id",
    as: "summaries",
  });
}

if (models.BalanceSheetReport) {
  models.BalanceSheetReport.hasMany(models.BalanceSheetLineItem, {
    foreignKey: "report_id",
    as: "lineItems",
  });
}

if (models.CashFlowReport) {
  models.CashFlowReport.hasMany(models.CashFlowLine, {
    foreignKey: "report_id",
    as: "lines",
  });

  models.CashFlowReport.hasOne(models.CashFlowTotal, {
    foreignKey: "report_id",
    as: "totals",
  });
}

export const {
  gl_account_master: GLAccountMaster,
  quickbook_account: QuickbookAccount,
  TrialBalanceReport,
  TrialBalanceColumn,
  TrialBalanceRow,
  PnLReport,
  PnLLine,
  PnLSummary,
  BalanceSheetReport,
  BalanceSheetLineItem,
  CashFlowReport,
  CashFlowLine,
  CashFlowTotal,
} = models;

export { sequelize };
export default models;
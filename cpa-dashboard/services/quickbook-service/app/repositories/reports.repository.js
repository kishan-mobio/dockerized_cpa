import {
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
  sequelize,
} from '../models/index.js';
import { 
  create, 
  findById, 
  update, 
  softDelete, 
  findAll, 
  paginate, 
  count 
} from '../utils/database.utils.js';
import { QUICKBOOKS_SEQUELIZE_OPERATORS } from '../utils/constants/config.constants.js';

const createReportFunction = (Model) => (reportData, options = {}) => create(Model, reportData, options);
const createBulkFunction = (Model) => (data, options = {}) => Model.bulkCreate(data, { validate: false, ignoreDuplicates: true, ...options });
const findByIdFunction = (Model) => (id, options = {}) => findById(Model, id, options);
const findByRealmIdFunction = (Model) => (realmId, options = {}) => findAll(Model, { where: { realm_id: realmId }, ...options });

export const reportsRepository = {
  
  createTrialBalanceReport: createReportFunction(TrialBalanceReport),
  createTrialBalanceColumns: createBulkFunction(TrialBalanceColumn),
  createTrialBalanceRows: createBulkFunction(TrialBalanceRow),
  findTrialBalanceReportById: findByIdFunction(TrialBalanceReport),
  findTrialBalanceReportsByRealmId: findByRealmIdFunction(TrialBalanceReport),

  async findOrCreateTrialBalanceColumn(whereConditions, defaults, options = {}) {
    return await TrialBalanceColumn.findOrCreate({
      where: whereConditions,
      defaults: defaults,
      ...options
    });
  },

  
  createPnLReport: createReportFunction(PnLReport),
  createPnLLines: createBulkFunction(PnLLine),
  createPnLSummaries: createBulkFunction(PnLSummary),
  findPnLReportById: findByIdFunction(PnLReport),
  findPnLReportsByRealmId: findByRealmIdFunction(PnLReport),

  async findOrCreatePnLLine(whereConditions, defaults, options = {}) {
    return await PnLLine.findOrCreate({
      where: whereConditions,
      defaults: defaults,
      ...options
    });
  },

  
  createBalanceSheetReport: createReportFunction(BalanceSheetReport),
  createBalanceSheetLineItems: createBulkFunction(BalanceSheetLineItem),
  findBalanceSheetReportById: findByIdFunction(BalanceSheetReport),
  findBalanceSheetReportsByRealmId: findByRealmIdFunction(BalanceSheetReport),

  async findOrCreateBalanceSheetLineItem(whereConditions, defaults, options = {}) {
    return await BalanceSheetLineItem.findOrCreate({
      where: whereConditions,
      defaults: defaults,
      ...options
    });
  },

  
  createCashFlowReport: createReportFunction(CashFlowReport),
  createCashFlowLines: createBulkFunction(CashFlowLine),
  createCashFlowTotals: createBulkFunction(CashFlowTotal),
  findCashFlowReportById: findByIdFunction(CashFlowReport),
  findCashFlowReportsByRealmId: findByRealmIdFunction(CashFlowReport),

  async findOrCreateCashFlowLine(whereConditions, defaults, options = {}) {
    return await CashFlowLine.findOrCreate({
      where: whereConditions,
      defaults: defaults,
      ...options
    });
  },


  async findPaginatedReports(Model, options = {}) {
    return await paginate(Model, options);
  },

  async countReportsByRealmId(Model, realmId, whereConditions = {}) {
    return await count(Model, {
      where: {
        realm_id: realmId,
        ...whereConditions
      }
    });
  },

  async softDeleteReport(Model, id, options = {}) {
    return await softDelete(Model, id, options);
  },

  async findReportWithRelatedData(Model, id, include = [], options = {}) {
    return await findById(Model, id, {
      include: include,
      ...options
    });
  },

  
  updateReport: (Model, id, updateData, options = {}) => update(Model, id, updateData, options),
  createTransaction: () => sequelize.transaction(),
  commitTransaction: (transaction) => transaction.commit(),
  rollbackTransaction: (transaction) => transaction.rollback(),
  
  deleteReportsByDateRange(Model, realmId, startDate, endDate, options = {}) {
    return Model.destroy({
      where: {
        realm_id: realmId,
        start_period: { [require('sequelize').Op[QUICKBOOKS_SEQUELIZE_OPERATORS.GTE]]: startDate },
        end_period: { [require('sequelize').Op[QUICKBOOKS_SEQUELIZE_OPERATORS.LTE]]: endDate }
      },
      ...options
    });
  }
};

export default reportsRepository;

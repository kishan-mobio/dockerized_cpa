import { DataTypes } from 'sequelize';

const BalanceSheetModels = (sequelize) => {
  // Balance Sheet Report Model (new schema)
  const BalanceSheetReport = sequelize.define(
    'BalanceSheetReport',
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      report_name: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      report_basis: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      currency: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      accounting_standard: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      generated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      raw: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      powerbi_kpi_json: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      realm_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'balance_sheet_reports',
      timestamps: false,
    }
  );

  // Balance Sheet Line Items Model (new schema)
  const BalanceSheetLineItem = sequelize.define(
    'BalanceSheetLineItem',
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      report_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'balance_sheet_reports',
          key: 'id',
        },
      },
      path: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      account_name: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      account_id: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        defaultValue: 0,
      },
      section: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      subsection: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      account_type: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      realm_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'balance_sheet_line_items',
      timestamps: false,
    }
  );

  // Define associations
  BalanceSheetReport.associate = (models) => {
    BalanceSheetReport.hasMany(models.BalanceSheetLineItem, {
      foreignKey: 'report_id',
      as: 'lineItems',
    });
  };

  BalanceSheetLineItem.associate = (models) => {
    BalanceSheetLineItem.belongsTo(models.BalanceSheetReport, {
      foreignKey: 'report_id',
      as: 'report',
    });
  };

  return {
    BalanceSheetReport,
    BalanceSheetLineItem,
  };
};

export default BalanceSheetModels;

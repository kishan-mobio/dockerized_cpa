import { DataTypes } from 'sequelize';

const ProfitLossModels = (sequelize) => {
  // P&L Report Model (new schema)
  const PnLReport = sequelize.define(
    'PnLReport',
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
      tableName: 'pnl_reports',
      timestamps: false,
    }
  );

  // P&L Line Item Model (new schema)
  const PnLLine = sequelize.define(
    'PnLLine',
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
          model: 'pnl_reports',
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
      category: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      realm_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'pnl_lines',
      timestamps: false,
    }
  );

  // P&L Summary Model (new schema)
  const PnLSummary = sequelize.define(
    'PnLSummary',
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
          model: 'pnl_reports',
          key: 'id',
        },
      },
      group: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      label: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      path: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        defaultValue: 0,
      },
      realm_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'pnl_summaries',
      timestamps: false,
    }
  );

  // Define associations
  PnLReport.associate = (models) => {
    PnLReport.hasMany(models.PnLLine, {
      foreignKey: 'report_id',
      as: 'lines',
    });
    PnLReport.hasMany(models.PnLSummary, {
      foreignKey: 'report_id',
      as: 'summaries',
    });
  };

  PnLLine.associate = (models) => {
    PnLLine.belongsTo(models.PnLReport, {
      foreignKey: 'report_id',
      as: 'report',
    });
  };

  PnLSummary.associate = (models) => {
    PnLSummary.belongsTo(models.PnLReport, {
      foreignKey: 'report_id',
      as: 'report',
    });
  };

  return {
    PnLReport,
    PnLLine,
    PnLSummary,
  };
};

export default ProfitLossModels;

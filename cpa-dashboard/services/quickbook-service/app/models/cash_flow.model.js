import { DataTypes } from 'sequelize';

const CashFlowModels = (sequelize) => {
  // Cash Flow Report Model (metadata)
  const CashFlowReport = sequelize.define(
    'CashFlowReport',
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
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
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
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'cash_flow_reports',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  // Cash Flow Line Model (line items)
  const CashFlowLine = sequelize.define(
    'CashFlowLine',
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
          model: 'cash_flow_reports',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      path: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Path from QuickBooks data for Cash Flow line categorization'
      },
      label: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      group: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Operating, Investing, Financing, NetCash, BeginningCash, EndingCash'
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
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'cash_flow_lines',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  // Cash Flow Total Model (summary totals)
  const CashFlowTotal = sequelize.define(
    'CashFlowTotal',
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      report_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
        references: {
          model: 'cash_flow_reports',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      operating: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },
      investing: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },
      financing: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },
      net_cash_flow: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },
      beginning_cash: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },
      ending_cash: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
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
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'cash_flow_totals',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  // Define associations
  CashFlowReport.associate = (models) => {
    CashFlowReport.hasMany(models.CashFlowLine, {
      foreignKey: 'report_id',
      as: 'lines',
    });
    CashFlowReport.hasOne(models.CashFlowTotal, {
      foreignKey: 'report_id',
      as: 'totals',
    });
  };

  CashFlowLine.associate = (models) => {
    CashFlowLine.belongsTo(models.CashFlowReport, {
      foreignKey: 'report_id',
      as: 'report',
    });
  };

  CashFlowTotal.associate = (models) => {
    CashFlowTotal.belongsTo(models.CashFlowReport, {
      foreignKey: 'report_id',
      as: 'report',
    });
  };

  return {
    CashFlowReport,
    CashFlowLine,
    CashFlowTotal,
  };
};

export default CashFlowModels;

import { DataTypes } from 'sequelize';

const TrialBalanceModels = (sequelize) => {
  // Trial Balance Report Model (metadata)
  const TrialBalanceReport = sequelize.define(
    'TrialBalanceReport',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      report_name: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      report_basis: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      start_period: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_period: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      summarize_columns_by: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      currency: {
        type: DataTypes.TEXT,
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
      tableName: 'trial_balance_reports',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  // Trial Balance Column Model
  const TrialBalanceColumn = sequelize.define(
    'TrialBalanceColumn',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      report_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'trial_balance_reports',
          key: 'id',
        },
      },
      col_title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      col_type: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      col_id: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      parent_col_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'trial_balance_columns',
          key: 'id',
        },
      },
      parent_col_title: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      realm_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      col_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      period_start: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      period_end: {
        type: DataTypes.DATEONLY,
        allowNull: true,
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
      tableName: 'trial_balance_columns',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  // Trial Balance Row Model (merged accounts + values)
  const TrialBalanceRow = sequelize.define(
    'TrialBalanceRow',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      report_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'trial_balance_reports',
          key: 'id',
        },
      },
      path: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      account_name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      quickbooks_account_id: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      acct_num: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      class_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      account_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      column_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'trial_balance_columns',
          key: 'id',
        },
      },
      realm_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0,
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
      tableName: 'trial_balance_rows',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  // Define associations
  TrialBalanceReport.associate = (models) => {
    TrialBalanceReport.hasMany(models.TrialBalanceColumn, {
      foreignKey: 'report_id',
      as: 'columns',
    });
    TrialBalanceReport.hasMany(models.TrialBalanceRow, {
      foreignKey: 'report_id',
      as: 'rows',
    });
  };

  TrialBalanceColumn.associate = (models) => {
    TrialBalanceColumn.belongsTo(models.TrialBalanceReport, {
      foreignKey: 'report_id',
      as: 'report',
    });
    TrialBalanceColumn.belongsTo(models.TrialBalanceColumn, {
      foreignKey: 'parent_col_id',
      as: 'parent',
    });
    TrialBalanceColumn.hasMany(models.TrialBalanceColumn, {
      foreignKey: 'parent_col_id',
      as: 'children',
    });
    TrialBalanceColumn.hasMany(models.TrialBalanceRow, {
      foreignKey: 'column_id',
      as: 'rows',
    });
  };

  TrialBalanceRow.associate = (models) => {
    TrialBalanceRow.belongsTo(models.TrialBalanceReport, {
      foreignKey: 'report_id',
      as: 'report',
    });
    TrialBalanceRow.belongsTo(models.TrialBalanceColumn, {
      foreignKey: 'column_id',
      as: 'column',
    });
  };

  return {
    TrialBalanceReport,
    TrialBalanceColumn,
    TrialBalanceRow,
  };
};

export default TrialBalanceModels;

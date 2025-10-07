import { DataTypes } from "sequelize";

const QuickbookAccountModel = (sequelize) => {
  const QuickbookAccount = sequelize.define(
    "quickbook_account",
    {
      id: {
        type: DataTypes.STRING, // QuickBooks Id comes as string
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      sub_account: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      fully_qualified_name: {
        type: DataTypes.TEXT,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      classification: {
        type: DataTypes.STRING,
      },
      account_type: {
        type: DataTypes.STRING,
      },
      account_sub_type: {
        type: DataTypes.STRING,
      },
      current_balance: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
      },
      current_balance_with_sub_accounts: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
      },
      currency_value: {
        type: DataTypes.STRING,
      },
      currency_name: {
        type: DataTypes.STRING,
      },
      domain: {
        type: DataTypes.STRING,
      },
      sparse: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      sync_token: {
        type: DataTypes.STRING,
      },
      create_time: {
        type: DataTypes.DATE,
      },
      last_updated_time: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "quickbook_account",
      timestamps: false,
      indexes: [
        {
          name: "account_name_key",
          fields: ["name"],
        },
      ],
    }
  );

  return QuickbookAccount;
};

export default QuickbookAccountModel;

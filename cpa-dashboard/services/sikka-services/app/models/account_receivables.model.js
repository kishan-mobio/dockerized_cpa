import { DataTypes } from "sequelize";

const AccountsReceivableModel = (sequelize) =>
  sequelize.define(
    "sikka_accounts_receivable",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      amount: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ar_benchmark: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      tableName: "sikka_accounts_receivable",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

export default AccountsReceivableModel;

import { DataTypes } from "sequelize";

const ProductionByHygienistModel = (sequelize) =>
  sequelize.define(
    "sikka_total_production_by_hygienist",
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
      tableName: "sikka_total_production_by_hygienist",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

export default ProductionByHygienistModel;

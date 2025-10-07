import { DataTypes } from "sequelize";

const AvgDailyProductionModel = (sequelize) =>
  sequelize.define(
    "sikka_avg_daily_production",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      display_name: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      tableName: "sikka_avg_daily_production",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

export default AvgDailyProductionModel;

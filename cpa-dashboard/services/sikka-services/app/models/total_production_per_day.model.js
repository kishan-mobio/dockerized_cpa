import { DataTypes } from "sequelize";

const ProductionPerDayModel = (sequelize) =>
  sequelize.define(
    "sikka_total_production_per_day",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      practice_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      procedure_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      practice_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total_production: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      tableName: "sikka_total_production_per_day",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

export default ProductionPerDayModel;

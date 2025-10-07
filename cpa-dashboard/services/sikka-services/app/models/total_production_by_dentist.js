import { DataTypes } from "sequelize";

const ProductionByDentistModel = (sequelize) =>
  sequelize.define(
    "sikka_total_production_by_dentist",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      provider_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      practice_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
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
      tableName: "sikka_total_production_by_dentist",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

export default ProductionByDentistModel;

import { DataTypes } from "sequelize";

const DirectRestorationsModel = (sequelize) =>
  sequelize.define(
    "sikka_direct_restorations",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      provider_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      practice_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      provider_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      practice_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      provider_lastname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      provider_firstname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "sikka_direct_restorations",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

export default DirectRestorationsModel;

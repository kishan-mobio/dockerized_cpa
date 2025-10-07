import { DataTypes } from "sequelize";

const HygieneReappointmentModel = (sequelize) =>
  sequelize.define(
    "sikka_hygiene_reappointment",
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
        allowNull: true,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      practice_name: {
        type: DataTypes.STRING,
        allowNull: true,
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
      tableName: "sikka_hygiene_reappointment",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

export default HygieneReappointmentModel;

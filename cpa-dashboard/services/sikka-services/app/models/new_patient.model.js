import { DataTypes } from "sequelize";

const NewPatientsModel = (sequelize) =>
  sequelize.define(
    "sikka_new_patients",
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
      new_patients: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      tableName: "sikka_new_patients",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

export default NewPatientsModel;

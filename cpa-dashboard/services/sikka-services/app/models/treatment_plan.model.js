import { DataTypes } from "sequelize";

const TreatmentPlanAnalysisModel = (sequelize) =>
  sequelize.define(
    "sikka_treatment_plan_analysis",
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
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      treatment_plan_status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      practice_name: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      tableName: "sikka_treatment_plan_analysis",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

export default TreatmentPlanAnalysisModel;

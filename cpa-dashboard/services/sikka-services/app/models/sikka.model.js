import { DataTypes } from "sequelize";

const RequestKeyModel = (sequelize) =>
  sequelize.define(
    "sikka_request_key",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      request_key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      office_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      expires_in: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "sikka_request_key",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

export default RequestKeyModel;

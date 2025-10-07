import { DataTypes } from "sequelize";
import {
  TABLE_NAMES,
  MODEL_FIELDS,
  INDEX_NAMES,
  ASSOCIATION_NAMES,
} from "../utils/constants.util.js";

const AppUserModel = (sequelize) => {
  const AppUser = sequelize.define(
    TABLE_NAMES.APP_USER,
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      tenant_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      password_hash: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      full_name: {
        type: DataTypes.TEXT,
      },
      phone_number: {
        type: DataTypes.TEXT,
      },
      roles: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
      },
      // Authentication fields
      email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      email_verified_at: {
        type: DataTypes.DATE,
      },
      last_login: {
        type: DataTypes.DATE,
      },
      // MFA fields
      mfa_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      mfa_secret: {
        type: DataTypes.TEXT,
      },
      mfa_backup_codes: {
        type: DataTypes.TEXT,
      },
      // Invitation fields
      invited_by: {
        type: DataTypes.UUID,
      },
      invited_at: {
        type: DataTypes.DATE,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      created_by: {
        type: DataTypes.UUID,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
      updated_by: {
        type: DataTypes.UUID,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: TABLE_NAMES.APP_USER,
      timestamps: true,
      createdAt: MODEL_FIELDS.CREATED_AT,
      updatedAt: MODEL_FIELDS.UPDATED_AT,
      indexes: [
        {
          name: INDEX_NAMES.UNIQUE_EMAIL_PER_TENANT,
          unique: true,
          fields: [MODEL_FIELDS.TENANT_ID, MODEL_FIELDS.EMAIL],
        },
      ],
    }
  );

  return AppUser;
};

export default AppUserModel;

import { DataTypes } from 'sequelize';

const AppUserModel = (sequelize) => {
  const AppUser = sequelize.define(
    'app_user',
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
        type: DataTypes.TEXT, // JSON string
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
    },
    {
      tableName: 'app_user',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        { name: 'idx_user_tenant', fields: ['tenant_id'] },
        {
          name: 'unique_email_per_tenant',
          unique: true,
          fields: ['tenant_id', 'email'],
        },
      ],
    }
  );

  AppUser.associate = (models) => {
    AppUser.belongsTo(models.tenant, {
      foreignKey: 'tenant_id',
      as: 'tenant',
      onDelete: 'CASCADE',
    });
    AppUser.belongsTo(models.app_user, {
      foreignKey: 'invited_by',
      as: 'inviter',
      onDelete: 'SET NULL',
    });
    // Direct relationships
    AppUser.hasMany(models.audit_log, {
      foreignKey: 'user_id',
      as: 'audit_logs',
    });
    AppUser.hasMany(models.app_token, {
      foreignKey: 'user_id',
      as: 'tokens',
    });
    AppUser.hasMany(models.app_user, {
      foreignKey: 'invited_by',
      as: 'invited_users',
    });
  };

  return AppUser;
};

export default AppUserModel;
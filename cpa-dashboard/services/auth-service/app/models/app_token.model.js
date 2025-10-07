import { DataTypes } from 'sequelize';

const AppTokenModel = (sequelize) => {
  const AppToken = sequelize.define(
    'app_token',
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
      user_id: {
        type: DataTypes.UUID,
        allowNull: true, // Null for invite tokens
      },
      token_type: {
        type: DataTypes.ENUM,
        values: ['access', 'refresh', 'reset', 'invite', 'email_verification', 'mfa_temp'],
        allowNull: false,
      },
      token_hash: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // JWT tokens
      access_token: {
        type: DataTypes.TEXT,
      },
      refresh_token: {
        type: DataTypes.TEXT,
      },
      // Reset tokens
      reset_token: {
        type: DataTypes.TEXT,
      },
      reset_token_expires_at: {
        type: DataTypes.DATE,
      },
      // Invite tokens
      invite_token: {
        type: DataTypes.TEXT,
      },
      invite_token_expires_at: {
        type: DataTypes.DATE,
      },
      // Email verification tokens
      email_verification_token: {
        type: DataTypes.TEXT,
      },
      email_verification_token_expires_at: {
        type: DataTypes.DATE,
      },
      // Token metadata
      metadata: {
        type: DataTypes.JSONB,
      },
      // Token lifecycle
      expires_at: {
        type: DataTypes.DATE,
      },
      last_used_at: {
        type: DataTypes.DATE,
      },
      revoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      revoked_at: {
        type: DataTypes.DATE,
      },
      revoked_by: {
        type: DataTypes.UUID,
      },
      used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      used_at: {
        type: DataTypes.DATE,
      },
      // Device/session info
      user_agent: {
        type: DataTypes.TEXT,
      },
      ip_address: {
        type: DataTypes.INET,
      },
      device_fingerprint: {
        type: DataTypes.TEXT,
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
      tableName: 'app_token',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        { name: 'idx_token_tenant', fields: ['tenant_id'] },
        { name: 'idx_token_user', fields: ['user_id'] },
        { name: 'idx_token_type', fields: ['token_type'] },
        { name: 'idx_token_hash', fields: ['token_hash'] },
        { name: 'idx_token_expires', fields: ['expires_at'] },
        { name: 'idx_token_revoked', fields: ['revoked'] },
        {
          name: 'unique_access_token_per_user',
          unique: true,
          fields: ['user_id', 'access_token'],
          where: {
            revoked: false,
            access_token: { [sequelize.Sequelize.Op.ne]: null }
          }
        },
        {
          name: 'unique_invite_token',
          unique: true,
          fields: ['invite_token'],
          where: {
            revoked: false,
            invite_token: { [sequelize.Sequelize.Op.ne]: null }
          }
        }
      ],
    }
  );

  AppToken.associate = (models) => {
    AppToken.belongsTo(models.tenant, {
      foreignKey: 'tenant_id',
      as: 'tenant',
      onDelete: 'CASCADE',
    });
    AppToken.belongsTo(models.app_user, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE',
    });
    AppToken.belongsTo(models.app_user, {
      foreignKey: 'revoked_by',
      as: 'revoker',
      onDelete: 'SET NULL',
    });
  };

  return AppToken;
};

export default AppTokenModel;
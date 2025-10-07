import { DataTypes } from 'sequelize';

const TenantModel = (sequelize) => {
  const Tenant = sequelize.define(
    'tenant',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      domain: {
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
      tableName: 'tenant',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        { name: 'tenant_domain_key', unique: true, fields: ['domain'] },
      ],
    }
  );

  Tenant.associate = (models) => {
    Tenant.hasMany(models.app_user, { foreignKey: 'tenant_id', as: 'users' });
    Tenant.hasMany(models.audit_log, {
      foreignKey: 'tenant_id',
      as: 'audit_logs',
    });
    Tenant.hasMany(models.role, { foreignKey: 'tenant_id', as: 'roles' });
    Tenant.hasMany(models.subscription, {
      foreignKey: 'tenant_id',
      as: 'subscriptions',
    });
    Tenant.hasMany(models.payment, { foreignKey: 'tenant_id', as: 'payments' });
    Tenant.hasMany(models.data_source_connection, {
      foreignKey: 'tenant_id',
      as: 'data_source_connections',
    });
    Tenant.hasMany(models.data_source_transaction, {
      foreignKey: 'tenant_id',
      as: 'data_source_transactions',
    });
    Tenant.hasMany(models.gl_account_master, {
      foreignKey: 'tenant_id',
      as: 'gl_accounts',
    });
    Tenant.hasMany(models.app_token, {
      foreignKey: 'tenant_id',
      as: 'tokens',
    });
  };

  return Tenant;
};

export default TenantModel;

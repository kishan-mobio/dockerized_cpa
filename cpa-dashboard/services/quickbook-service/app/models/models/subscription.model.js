import { DataTypes } from 'sequelize';

const SubscriptionModel = (sequelize) => {
  const Subscription = sequelize.define(
    'subscription',
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
      subscription_plan_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
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
      tableName: 'subscription',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [{ name: 'idx_subscription_tenant', fields: ['tenant_id'] }],
    }
  );

  Subscription.associate = (models) => {
    Subscription.belongsTo(models.tenant, {
      foreignKey: 'tenant_id',
      as: 'tenant',
      onDelete: 'CASCADE',
    });
    Subscription.belongsTo(models.subscription_plan, {
      foreignKey: 'subscription_plan_id',
      as: 'plan',
      onDelete: 'RESTRICT',
    });
    Subscription.hasMany(models.payment, {
      foreignKey: 'subscription_id',
      as: 'payments',
    });
  };

  return Subscription;
};

export default SubscriptionModel;

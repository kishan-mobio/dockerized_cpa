import { DataTypes } from 'sequelize';

const SubscriptionPlanModel = (sequelize) => {
  const SubscriptionPlan = sequelize.define(
    'subscription_plan',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      plan_name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      billing_cycle: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      features: {
        type: DataTypes.JSONB,
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
      tableName: 'subscription_plan',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  SubscriptionPlan.associate = (models) => {
    SubscriptionPlan.hasMany(models.subscription, {
      foreignKey: 'subscription_plan_id',
      as: 'subscriptions',
    });
  };

  return SubscriptionPlan;
};

export default SubscriptionPlanModel;

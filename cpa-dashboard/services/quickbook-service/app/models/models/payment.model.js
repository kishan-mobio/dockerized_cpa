import { DataTypes } from 'sequelize';

const PaymentModel = (sequelize) => {
  const Payment = sequelize.define(
    'payment',
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
      subscription_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      payment_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      payment_method_type_id: {
        type: DataTypes.UUID,
        allowNull: false,
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
      tableName: 'payment',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        { name: 'idx_payment_subscription', fields: ['subscription_id'] },
        { name: 'idx_payment_tenant', fields: ['tenant_id'] },
      ],
    }
  );

  Payment.associate = (models) => {
    Payment.belongsTo(models.tenant, {
      foreignKey: 'tenant_id',
      as: 'tenant',
      onDelete: 'CASCADE',
    });
    Payment.belongsTo(models.subscription, {
      foreignKey: 'subscription_id',
      as: 'subscription',
      onDelete: 'RESTRICT',
    });
    Payment.belongsTo(models.payment_method_type, {
      foreignKey: 'payment_method_type_id',
      as: 'method_type',
      onDelete: 'RESTRICT',
    });
  };

  return Payment;
};

export default PaymentModel;

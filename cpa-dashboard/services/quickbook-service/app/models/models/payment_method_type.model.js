import { DataTypes } from 'sequelize';

const PaymentMethodTypeModel = (sequelize) => {
  const PaymentMethodType = sequelize.define(
    'payment_method_type',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      method_name: { 
        type: DataTypes.TEXT, 
        allowNull: false 
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
      tableName: 'payment_method_type',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          name: 'payment_method_type_method_name_key',
          unique: true,
          fields: ['method_name'],
        },
      ],
    }
  );

  PaymentMethodType.associate = (models) => {
    PaymentMethodType.hasMany(models.payment, {
      foreignKey: 'payment_method_type_id',
      as: 'payments',
    });
  };

  return PaymentMethodType;
};

export default PaymentMethodTypeModel;

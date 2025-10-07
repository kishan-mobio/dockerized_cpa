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
      is_deleted:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
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

  return Tenant;
};

export default TenantModel;

import { DataTypes } from 'sequelize';

const GLAccountMasterModel = (sequelize) => {
  const GLAccountMaster = sequelize.define(
    'gl_account_master',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      code: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      type: { type: DataTypes.TEXT, allowNull: false },
      is_global: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      tenant_id: {
        type: DataTypes.UUID,
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
      tableName: 'gl_account_master',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          name: 'unique_gl_code_per_tenant',
          unique: true,
          fields: ['tenant_id', 'code'],
        },
        { name: 'idx_gl_tenant', fields: ['tenant_id'] },
      ],
    }
  );

  GLAccountMaster.associate = (models) => {
    // Only associate if tenant model is available
    if (models.tenant) {
      GLAccountMaster.belongsTo(models.tenant, {
        foreignKey: 'tenant_id',
        as: 'tenant',
        onDelete: 'CASCADE',
      });
    }
  };

  return GLAccountMaster;
};

export default GLAccountMasterModel;

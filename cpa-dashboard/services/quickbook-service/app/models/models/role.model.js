import { DataTypes } from 'sequelize';

const RoleModel = (sequelize) => {
  const Role = sequelize.define(
    'role',
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
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
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
      tableName: 'role',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          name: 'unique_role_name_per_tenant',
          unique: true,
          fields: ['tenant_id', 'name'],
        },
        { name: 'idx_role_tenant', fields: ['tenant_id'] },
      ],
    }
  );

  Role.associate = (models) => {
    Role.belongsTo(models.tenant, {
      foreignKey: 'tenant_id',
      as: 'tenant',
      onDelete: 'CASCADE',
    });
    Role.hasMany(models.role_permission_mapping, {
      foreignKey: 'role_id',
      as: 'permission_mappings',
    });
    Role.belongsToMany(models.permission, {
      through: models.role_permission_mapping,
      foreignKey: 'role_id',
      otherKey: 'permission_id',
      as: 'permissions',
    });
  };

  return Role;
};

export default RoleModel;

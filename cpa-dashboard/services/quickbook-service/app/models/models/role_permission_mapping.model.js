import { DataTypes } from 'sequelize';

const RolePermissionMappingModel = (sequelize) => {
  const RolePermissionMapping = sequelize.define(
    'role_permission_mapping',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      role_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      permission_id: {
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
      tableName: 'role_permission_mapping',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          name: 'idx_rpm_role',
          fields: ['role_id'],
        },
        {
          name: 'idx_rpm_permission',
          fields: ['permission_id'],
        },
        {
          name: 'unique_role_permission',
          unique: true,
          fields: ['role_id', 'permission_id'],
        },
      ],
    }
  );

  RolePermissionMapping.associate = (models) => {
    RolePermissionMapping.belongsTo(models.role, {
      foreignKey: 'role_id',
      as: 'role',
      onDelete: 'CASCADE',
    });
    RolePermissionMapping.belongsTo(models.permission, {
      foreignKey: 'permission_id',
      as: 'permission',
      onDelete: 'CASCADE',
    });
  };

  return RolePermissionMapping;
};

export default RolePermissionMappingModel;

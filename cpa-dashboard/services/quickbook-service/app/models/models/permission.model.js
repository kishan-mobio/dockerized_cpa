import { DataTypes } from 'sequelize';

const PermissionModel = (sequelize) => {
  const Permission = sequelize.define(
    'permission',
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
      tableName: 'permission',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          name: 'permission_name_key',
          unique: true,
          fields: ['name'],
        },
      ],
    }
  );

  Permission.associate = (models) => {
    Permission.hasMany(models.role_permission_mapping, {
      foreignKey: 'permission_id',
      as: 'role_mappings',
    });
    Permission.belongsToMany(models.role, {
      through: models.role_permission_mapping,
      foreignKey: 'permission_id',
      otherKey: 'role_id',
      as: 'roles',
    });
  };

  return Permission;
};

export default PermissionModel;

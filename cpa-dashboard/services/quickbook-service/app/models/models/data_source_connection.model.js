import { DataTypes } from 'sequelize';

const DataSourceConnectionModel = (sequelize) => {
  const DataSourceConnection = sequelize.define(
    'data_source_connection',
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
      data_source_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      connection_name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      auth_type: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      access_token: {
        type: DataTypes.TEXT,
      },
      refresh_token: {
        type: DataTypes.TEXT,
      },
      config_json: {
        type: DataTypes.JSONB,
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
      tableName: 'data_source_connection',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          name: 'unique_connection_per_tenant',
          unique: true,
          fields: ['tenant_id', 'data_source_id', 'connection_name'],
        },
        { name: 'idx_dsc_source', fields: ['data_source_id'] },
        { name: 'idx_dsc_tenant', fields: ['tenant_id'] },
      ],
    }
  );

  DataSourceConnection.associate = (models) => {
    DataSourceConnection.belongsTo(models.tenant, {
      foreignKey: 'tenant_id',
      as: 'tenant',
      onDelete: 'CASCADE',
    });
    DataSourceConnection.belongsTo(models.data_source, {
      foreignKey: 'data_source_id',
      as: 'data_source',
      onDelete: 'RESTRICT',
    });
  };

  return DataSourceConnection;
};

export default DataSourceConnectionModel;

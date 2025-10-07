import { DataTypes } from 'sequelize';

const DataSourceModel = (sequelize) => {
  const DataSource = sequelize.define(
    'data_source',
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
      type: {
        type: DataTypes.TEXT,
        allowNull: false,
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
      tableName: 'data_source',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  DataSource.associate = (models) => {
    DataSource.hasMany(models.data_source_connection, {
      foreignKey: 'data_source_id',
      as: 'connections',
    });
    DataSource.hasMany(models.data_source_transaction, {
      foreignKey: 'data_source_id',
      as: 'transactions',
    });
  };

  return DataSource;
};

export default DataSourceModel;

import { DataTypes } from 'sequelize';

const DataSourceTransactionModel = (sequelize) => {
  const DataSourceTransaction = sequelize.define(
    'data_source_transaction',
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
      source_entity: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      external_id: {
        type: DataTypes.TEXT,
      },
      data_payload: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      sync_status: {
        type: DataTypes.TEXT,
        defaultValue: 'pending',
      },
      synced_at: {
        type: DataTypes.DATE,
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
      tableName: 'data_source_transaction',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          name: 'unique_external_id_per_source',
          unique: true,
          fields: ['tenant_id', 'data_source_id', 'external_id'],
        },
        { name: 'idx_dst_source', fields: ['data_source_id'] },
        { name: 'idx_dst_tenant', fields: ['tenant_id'] },
      ],
    }
  );

  DataSourceTransaction.associate = (models) => {
    DataSourceTransaction.belongsTo(models.tenant, {
      foreignKey: 'tenant_id',
      as: 'tenant',
      onDelete: 'CASCADE',
    });
    DataSourceTransaction.belongsTo(models.data_source, {
      foreignKey: 'data_source_id',
      as: 'data_source',
      onDelete: 'RESTRICT',
    });
  };

  return DataSourceTransaction;
};

export default DataSourceTransactionModel;

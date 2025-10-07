import { DataTypes } from 'sequelize';

const AuditLogModel = (sequelize) => {
  const AuditLog = sequelize.define(
    'audit_log',
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
      user_id: {
        type: DataTypes.UUID,
      },
      event_type_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      event_timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
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
      tableName: 'audit_log',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        { name: 'idx_audit_event_type', fields: ['event_type_id'] },
        { name: 'idx_audit_tenant', fields: ['tenant_id'] },
        { name: 'idx_audit_user', fields: ['user_id'] },
      ],
    }
  );

  AuditLog.associate = (models) => {
    AuditLog.belongsTo(models.tenant, {
      foreignKey: 'tenant_id',
      as: 'tenant',
      onDelete: 'CASCADE',
    });
    AuditLog.belongsTo(models.app_user, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'SET NULL',
    });
    AuditLog.belongsTo(models.event_type, {
      foreignKey: 'event_type_id',
      as: 'event_type',
      onDelete: 'RESTRICT',
    });
  };

  return AuditLog;
};

export default AuditLogModel;

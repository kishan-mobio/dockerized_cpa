import { DataTypes } from 'sequelize';

const EventTypeModel = (sequelize) => {
  const EventType = sequelize.define(
    'event_type',
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
      tableName: 'event_type',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        { name: 'event_type_name_key', unique: true, fields: ['name'] },
      ],
    }
  );

  EventType.associate = (models) => {
    EventType.hasMany(models.audit_log, {
      foreignKey: 'event_type_id',
      as: 'audit_logs',
    });
  };

  return EventType;
};

export default EventTypeModel;

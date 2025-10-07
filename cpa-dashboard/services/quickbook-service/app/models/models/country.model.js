import { DataTypes } from 'sequelize';

const CountryModel = (sequelize) => {
  const Country = sequelize.define(
    'country',
    {
      code: {
        type: DataTypes.TEXT,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
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
      tableName: 'country',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Country.associate = () => {};

  return Country;
};

export default CountryModel;

import sequelize from "../../config/postgres.js";
import TenantModel from "./tenant.model.js";

const models = {
  tenant: TenantModel(sequelize),
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export const { tenant: Tenant } = models;
export default models;

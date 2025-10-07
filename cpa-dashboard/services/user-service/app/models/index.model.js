import sequelize from "../../config/aws-config.js";
import AppUserModel from "./user.model.js";

const models = {
  app_user: AppUserModel(sequelize),
};

// Set up associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export individual models for convenience
export const { app_user: AppUser } = models;

// Export all models and sequelize instance
export { sequelize };
export default models;

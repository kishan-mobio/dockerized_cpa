import sequelize from "../../config/postgres.config.js";
import AppUserModel from "./app_user.model.js";
import AppTokenModel from "./app_token.model.js";

const models = {
  app_user: AppUserModel(sequelize),
  app_token: AppTokenModel(sequelize),
};

if (models.app_user && models.app_token) {
  models.app_user.belongsTo(models.app_user, {
    foreignKey: "invited_by",
    as: "inviter",
    onDelete: "SET NULL",
  });

  models.app_user.hasMany(models.app_token, {
    foreignKey: "user_id",
    as: "tokens",
  });

  models.app_user.hasMany(models.app_user, {
    foreignKey: "invited_by",
    as: "invited_users",
  });

  models.app_token.belongsTo(models.app_user, {
    foreignKey: "user_id",
    as: "user",
    onDelete: "CASCADE",
  });
}

export const {
  app_user: AppUser,
  app_token: AppToken,
} = models;

export { sequelize };
export default models;
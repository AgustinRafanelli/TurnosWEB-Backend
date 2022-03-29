const S = require("sequelize");
const sequelize = require("../config/db");

class Token extends S.Model { }

Token.init(
  {
    token: {
      type: S.DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Se requiere un token"
        },
      }
    }
  },
  { sequelize, modelName: "tokens" }
);

module.exports = Token;
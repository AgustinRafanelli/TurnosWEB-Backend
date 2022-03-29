const { DATEONLY } = require("sequelize");
const S = require("sequelize");
const sequelize = require("../config/db");

class Turn extends S.Model { }

Turn.init(
  {
    date: {
      type: S.DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Se requiere una fecha"
        },
      }
    }, 
    time: {
      type: S.DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Se requiere una hora"
        },
      }
    }, 
    state: {
      type: S.DataTypes.ENUM("pending", "canceled", "assisted"),
      defaultValue: "pending",
      validate: {
        isIn: {
          args: [["pending", "canceled", "assisted"]],
          msg: "El estado indicado no existe"
        }
      }
    },
  },
  { sequelize, modelName: "turns" , timestamps: false}
);

module.exports = Turn;
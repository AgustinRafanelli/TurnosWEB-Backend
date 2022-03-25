const { DATE } = require("sequelize");
const S = require("sequelize");
const sequelize = require("../config/db");

class Turn extends S.Model { }

Turn.init(
  {
    date: {
      type: S.DataTypes.DATE,
      validate: {
        notEmpty: {
          args: true,
          msg: "Se requiere una fecha"
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

console.log(new Date('2022-03-16T14:30Z'))

module.exports = Turn;
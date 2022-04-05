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
      type: S.DataTypes.ENUM("pending", "canceled", "assisted", "missed"),
      defaultValue: "pending",
      validate: {
        isIn: {
          args: [["pending", "canceled", "assisted", "missed"]],
          msg: "El estado indicado no existe"
        }
      }
    },
  },
  { sequelize, modelName: "turns" , timestamps: false}
);

Turn.afterCreate( turn =>{
  
})

module.exports = Turn;

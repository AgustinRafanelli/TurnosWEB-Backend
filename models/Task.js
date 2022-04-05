const S = require("sequelize");
const sequelize = require("../config/db");

class Task extends S.Model { }

Task.init({
    process_date: {
        type: S.DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Se requiere una fecha"
          },
        }
      },
      process_time: {
        type: S.DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Se requiere una hora"
          },
        }
      },
     name: {
        type: S.DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Completar el string"
          },
        }
      },
      complete: {
        type: S.DataTypes.BOOLEAN,
        defaultValue: false
      },
      email: {
        type: S.DataTypes.STRING,
        validate: {
          isEmail: true,
          notEmpty: {
            args: true,
            msg: "Se requiere un email"
          }
        },
      },

    },{ sequelize, modelName: "tasks" }
)

module.exports = Task;
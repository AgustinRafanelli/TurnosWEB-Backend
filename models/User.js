const S = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/db");

class User extends S.Model { }

User.init(
  {
    name: {
      type: S.DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Se requiere un nombre"
        },
        is: {
          args: ["^[a-z]+$", 'i'],
          msg: "Solo se permiten letras en el nombre"
        },
        max: {
          args: 32,
          msg: "Maximo 32 caracteres permitidos"
        },
        min: {
          args: 4,
          msg: "Minimo 4 caracteres permitidos"
        }
      }

    },
    lastname: {
      type: S.DataTypes.STRING,
      validate: {

        notEmpty: {
          args: true,
          msg: "Se requiere un apellido"
        },
        is: {
          args: ["^[a-z]+$", 'i'],
          msg: "Solo se permiten letras en el apellido"
        },
        max: {
          args: 32,
          msg: "Maximo 32 caracteres permitidos"
        },
        min: {
          args: 4,
          msg: "Minimo 4 caracteres permitidos"
        }
      }
    },
    dni: {
      type: S.DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Se requiere un DNI"
        },
        isInt: {
          args: true,
          msg: "El DNI debe ser un numero"
        },
        len:{
          args: [8,8],
          msg: "El DNI debe tener 8 numeros"
        }
      }
    },
    email: {
      type: S.DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: {
          args: true,
          msg: "Se requiere un email"
        }
      },
    },
    role: {
      type: S.DataTypes.ENUM("client", "admin", "operator", "superAdmin"),
      defaultValue: "client",
      validate:{
        isIn: {
          args: [["client", "admin", "operator", "superAdmin"]],
          msg: "El rol indicado no existe"
        }
      }
    },
    password: {
      type: S.DataTypes.STRING,
      allowNull: false,
      validate: {
        min: {
          args: 8,
          msg: "Minimo 8 caracteres permitidos"
        }
      }
    },
    salt: {
      type: S.DataTypes.STRING,
    },
  },
  { sequelize, modelName: "users" }
);

User.prototype.hash = (password, salt) => {
  return bcrypt.hash(password, salt);
};

User.beforeCreate(user => {
  return bcrypt
    .genSalt(16)
    .then(salt => {
      user.salt = salt;
      return user.hash(user.password, user.salt);
    })
    .then(hash => (user.password = hash));
});


module.exports = User;
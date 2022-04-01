const S = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/db");
const Turn = require("./Turn");
const Branch = require("./Branch")

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
          args: /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g,
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
          args: /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g,
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
        len: {
          args: [8, 8],
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
      type: S.DataTypes.ENUM("client", "admin", "operator"),
      defaultValue: "client",
      validate: {
        isIn: {
          args: [["client", "admin", "operator"]],
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
    .genSalt(4)
    .then(salt => {
      user.salt = salt;
      return user.hash(user.password, user.salt);
    })
    .then(hash => (user.password = hash));
});

User.prototype.newTurn = function ({branchId, date, time}) {
  return Turn.findOne({ where: { userId: this.id, state: "pending" } })
  .then(turn => {
    if (turn) return "Usted ya posee un turno pendiente"
    return Branch.findByPk(branchId)
      .then( async branch => {
        if(!branch) return "La sucursal elegida no existe"
        const {count} = await Turn.findAndCountAll({ where: { branchId, date, time} })
        if (count >= branch.maxPerTurn) return "Exede la cantidad maxima de personas por turno"
        return this.addTurn(branch, { through: { date, time, state: "pending" } })
          .then(turn => {
            return "Turno creado exitosamente"
          })
      })
    })
    .catch(err => console.log(err))
}

User.updatePassword = function (id, password) {
  return bcrypt
    .genSalt(4)
    .then(salt => {
      return bcrypt.hash(password, salt)
        .then(hash => {
          return User.update({ password: hash, salt }, { where: { id }, returning: true })
        })
        .then(user => user[1][0])
    })
}

module.exports = User;
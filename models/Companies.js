const S = require("sequelize");
const db = require("../config/db");

class Companies extends S.Model {}

Companies.init ({
    name: {
        type: S.STRING,
        allowNull: false,
        unique: true,
        validate:{
        isAlpha: true
        }
    },
    cuit: {
        type: S.STRING,
        allowNull: false,
        validate:{
            len: [11,11],
            isInt: true,
        }
    },
    urlLogo: {
        type: S.STRING,
        allowNull: false,
    },
}, { sequelize: db, modelName: 'companies' })

module.exports = Company;


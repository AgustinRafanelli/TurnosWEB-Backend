const S = require("sequelize");
const db = require("../config/db");

class Branch extends S.Model { }

Branch.init({
    name: {
        type: S.STRING,
        allowNull: false,
    },
    coords: {
        type: S.STRING,
        allowNull: false,
    },
    maxPerTurn: {
        type: S.INTEGER,
        allowNull: false,
    },
    turnRange: {
        type: S.JSON,
        allowNull: false,
        //{ open: 0-24, close: 0-24 }
    },
}, { sequelize: db, modelName: 'branches' })

module.exports = Branch;
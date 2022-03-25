const S = require("sequelize");
const db = require("../config/db");

class Branches extends S.Model { }


Branches.init({
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
        //{sunday: {start:0,end:0},monday: {start: 10, end: 19}, tuesday: {start: 10, end: 19} }

        allowNull: false,
    },
}, { sequelize: db, modelName: 'branches' })

module.exports = Branches;
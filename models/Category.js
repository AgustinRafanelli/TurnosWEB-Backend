const S = require("sequelize");
const db = require("../config/db");

class Category extends S.Model {}

Branches.init ({
    name: {
        type: S.STRING,
        allowNull: false,
    },    
}, { sequelize: db, modelName: 'categories' })

module.exports = Category;
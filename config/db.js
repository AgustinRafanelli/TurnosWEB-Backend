const {Sequelize} = require("sequelize")
const db = new Sequelize('cruce', null, null, {
  host: process.env.PSQL_HOST || 'localhost',
  dialect: 'postgres',
  logging: false,
})

module.exports = db;
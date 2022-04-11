const {Sequelize} = require("sequelize")

if (process.env.NODE_ENV === "production") {
  var db = new Sequelize(process.env.DATABASE_URL);
} else {
  const db = new Sequelize('cruce', null, null, {
    host: process.env.PSQL_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,
  })
}

module.exports = db;
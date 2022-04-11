const {Sequelize} = require("sequelize")
let db
if (process.env.NODE_ENV === "production") {
  db = new Sequelize(process.env.DATABASE_URL)
} else {
  db = new Sequelize(
  'cruce', 
  null, 
  null, 
  {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
  })
}

module.exports = db;
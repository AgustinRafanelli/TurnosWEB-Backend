const {Sequelize} = require("sequelize")
let db
if (process.env.NODE_ENV === "production") {
  db = new Sequelize(new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  })
)
} else {
  db = new Sequelize('cruce', 
  null, 
  null, 
  {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
    ssl: true
  })
}

module.exports = db;
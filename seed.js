const { User, Turn, Branch } = require("./models")

User.create({ 
  name: "Agustin", 
  lastname: "Rafanelli", 
  dni: "12345678", 
  email: "agustinrafa1995@gmail.com", 
  role: "client", 
  password: "12345678" })
  .then(user => {
    Branch.create({
      name: "empanada", 
      coords:"no se", 
      maxPerTurn: 5, 
      turnRange: JSON.stringify({coso:'hola'}) })
    .then(branch => {
      user.addTurn(branch, { through: { date: "2022-03-16T14:30:00.000Z", state: "pending" } })
    })
  })

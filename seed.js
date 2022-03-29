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
      coords: "-90.000, -180.0000", 
      maxPerTurn: 4, 
      turnRange: JSON.stringify({coso:'hola'}) })
    .then(branch => {
     // user.addTurn(branch, { through: { date: "2022-03-16T14:30:00.000Z", state: "pending" } })
      /* user.newTurn(branch.id, "2022-03-16","14:30")
        .then(console.log) */
    })
  })
  .catch(console.log)
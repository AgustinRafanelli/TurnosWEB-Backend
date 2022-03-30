const { User, Turn, Branch } = require("./models")

User.create({ name: "Agustin", lastname: "Rafanelli", dni: "12345688", email: "agustinrafa1995@hotmail.com", role: "admin", password: "12345678" })
User.create({ name: "Juancarlo", lastname: "Chupapija", dni: "12345888", email: "Juancarlo@hotmail.com", role: "client", password: "12345678" })
User.create({ name: "El", lastname: "Fantasma", dni: "12348888", email: "ElFantasma@hotmail.com", role: "client", password: "12345678" })
User.create({ name: "Nico", lastname: "Requejo", dni: "12388888", email: "requejo@hotmail.com", role: "client", password: "12345678" })
User.create({
  name: "Agustin",
  lastname: "Rafanelli",
  dni: "12345678",
  email: "agustinrafa1995@gmail.com",
  role: "client",
  password: "12345678"
})
  .then(user => {
    Branch.create({
      name: "empanada",
      coords: "-90.000, -180.0000",
      maxPerTurn: 4,
      turnRange: JSON.stringify({ coso: 'hola' })
    })
      .then(branch => {
        // user.addTurn(branch, { through: { date: "2022-03-16T14:30:00.000Z", state: "pending" } })
        user.newTurn({ branchId: branch.id, date: "2022-03-16", time: "14:30" })
          .then(console.log)
      })
      .then(() => {
        Turn.create({ date: "2022-03-16", time: "14:30", state: "pending", branchId: 1, userId: 1 })
        Turn.create({ date: "2022-03-16", time: "14:00", state: "pending", branchId: 1, userId: 2 })
        Turn.create({ date: "2022-03-16", time: "15:30", state: "pending", branchId: 1, userId: 3 })
        Turn.create({ date: "2022-03-16", time: "15:30", state: "pending", branchId: 1, userId: 4 })
      })
      .catch(console.log)
  })
  .catch(console.log)

let dates = Date.parse("2022-03-30" + " " + "14:30") + 7200000
console.log(dates,"  ", Date.now())
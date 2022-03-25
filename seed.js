const { User, Turn } = require("./models")


User.create({ name: "Agustin", lastname: "Rafanelli", dni: "12345678", email: "agustinrafa1995@gmail.com", role: "superAdmin", password: "12345678" })
Turn.create({ date: "2022-03-16T14:30:00.000Z", state: "pending" })
  .catch(err => console.log(err))


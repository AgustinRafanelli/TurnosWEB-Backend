const { Turn } = require("./models")
const { Op } = require("sequelize")

const dia = new Date(Date.now() - 3600000)
const time = `${dia.getHours()}:${dia.getMinutes()}`
const date = dia.toISOString().slice(0, 10)
console.log(date, "     ", time)
Turn.update({ state: 'missed' }, {
  where: {
    date,
    state: 'pending',
    time: {
      [Op.lt]: time
    }
  },
  returning: true
})
  .then(([count, turns]) => {
    console.log(count, " turnos modificados")
    console.log(turns)
  })
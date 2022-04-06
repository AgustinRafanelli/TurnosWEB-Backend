const cron = require('node-cron');
const { Turn } = require('../models');
const { Op } = require("sequelize")

cron.schedule('* * * * *',()=>{
    let dia = new Date();
    
    let seconds = dia.getSeconds();
    let minutes = dia.getMinutes();
    let hour = dia.getHours();

    console.log("Hola Bigotes estoy corriendo un CRON: ", hour, minutes, seconds);
});

cron.schedule('1 00 * * *', ()=>{
    const date = new Date().toISOString().slice(0, 10)
    Turn.update({ state: 'missed' }, {
        where: {
            date: {
                [Op.lt]: date
            },
            state: 'pending'
        },
        returning: true
    })
        .then(([count, turns]) => {
            console.log(count, " turnos de ayer actualizados a missed")
            console.log(turns)
        })
})

cron.schedule('*/15 * * * *', () => {
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
})

module.exports = cron;
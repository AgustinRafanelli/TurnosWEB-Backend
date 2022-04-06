const cron = require('node-cron');
const { Turn } = require("../models");
const { formatDate } = require("../routes/utils");
const emails = require('../routes/emailTemplates')
const { Task }= require("../models");
const { Op } = require("sequelize")

cron.schedule('*/60 * * * *',()=>{
    let dateActual = new Date();
    let hoursActual = dateActual.getHours();
    dateActual =formatDate(dia);

    Task.findAll({ where: { date: dateActual}})
    .then(tasks => {
        tasks.map(task =>{
            if(hoursActual === task.time.substring(0,2))
            if(task.name==="Aviso por Email 24hs" && task.complete===false){
                sgMail.send(emails.avisoTurno24hs(task.email,task.date))
                .then(stats =>{ task.complete=true;
                                Task.update(task); })
            }
        })
        .catch((err) => { console.log(err);});
    })
    
    
    console.log("Hola! Estoy corriendo el primer CRON : ", formatDate(dateActual));
})

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
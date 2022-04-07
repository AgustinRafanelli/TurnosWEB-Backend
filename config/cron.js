const cron = require('node-cron');
const { Turn } = require("../models");
const { formatDate } = require("../routes/utils");
const emails = require('../routes/emailTemplates');
const sgMail = require('../config/sendgrid')
const { Task }= require("../models");
const { Op } = require("sequelize")

cron.schedule('1 * * * *',()=>{
    let countSendMail = 0;
    let dateActual = new Date();
    let hoursActual = dateActual.getHours();
    dateActual =formatDate(dateActual);

    Task.findAll({ where: { process_date: dateActual, complete:false, name:"Aviso por Email 24hs" }})
    .then(tasks => {
        if(tasks.length>0){
        tasks.map(task =>{
            if(hoursActual.toString() === task.dataValues.process_time.substring(0,2))
            { 
                User.findOne({where: {email: task.dataValues.email}})
                .then(user=>{
                    Turn.findOne({where: {userId: user.id}})
                    .then(turn => {
                        Branch.findOne({where: {id: turn.branchId}})
                        .then(branch =>{
                            sgMail.send(emails.avisoTurno24hs(user.email,turn.date,turn.time,branch.name))
                            .then(stats =>{ countSendMail++;
                                task.update({complete: true})})
                        })
                    })
                })
            }
        })
    }
    console.log("Se corrio el aviso de 24hs antes, se enviaron ", countSendMail ," mail");   
    })
    .catch((err) => { console.log(err);}); 
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

cron.schedule('59 * * * *', () => {
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
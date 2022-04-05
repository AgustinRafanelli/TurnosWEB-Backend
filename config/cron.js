const cron = require('node-cron');
const { Turn } = require("../models");
const { formatDate } = require("../routes/utils");
const emails = require('../routes/emailTemplates')
const { Task }= require("../models");

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


cron.schedule('*/60 * * * *',()=>{
    let dia = new Date('2022-07-01');
    
    let seconds = dia.getSeconds();
    let minutes = dia.getMinutes();
    let hour = dia.getHours();

    console.log("Hola! Estoy corriendo el segundo CRON : ", dia);
});

module.exports = cron;
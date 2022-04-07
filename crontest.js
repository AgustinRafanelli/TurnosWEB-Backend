const { Task , Turn, User, Branch }= require("./models");
const { Op } = require("sequelize");
const { formatDate } = require("./routes/utils");
const emails = require('./routes/emailTemplates');
const sgMail = require('./config/sendgrid')

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
                    .then(stats =>{ task.update({complete: true})})
                  })
              })
              
            })
            
         }
      })
  }
    
})
.catch((err) => { console.log(err);});

console.log("Hola! Estoy corriendo el primer CRON : ", dateActual);
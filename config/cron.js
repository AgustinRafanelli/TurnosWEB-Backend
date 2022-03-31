const cron = require('node-cron');

cron.schedule('* * * * *',()=>{
    let dia = new Date();
    
    let seconds = dia.getSeconds();
    let minutes = dia.getMinutes();
    let hour = dia.getHours();

    console.log("Hola Bigotes estoy corriendo un CRON: ", hour, minutes, seconds);
});

module.exports = cron;
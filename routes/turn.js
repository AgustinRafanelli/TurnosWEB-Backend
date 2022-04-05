const express = require("express");
const router = express.Router();
const { User, Turn, Branch, Task } = require("../models");
const sgMail = require('../config/sendgrid')
const emails = require('./emailTemplates')
const { isLogged, isOperator, isSameUser, isSameUserOrOpetator, formatDate } = require("./utils");

//Turno (1) pending para un determinado Usuario
router.get("/pending/:userId", isLogged, (req, res) => {
    const { userId } = req.params;
    User.findOne({ where: { id: userId } })
      .then((user) => {
        Turn.findOne({ 
          where: { userId, state: "pending" },
          include: { 
            model: Branch,
            attributes: ["name", 'coords']
          }  })
        .then((turn) => {
          if (!turn) return res.status(400).send("No existe un turno activo")
          res.status(200).send(turn);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });

//Alta de Turno
router.post("/", isLogged, (req, res, next) => {
  const turn = req.body;
  const { id, email } = req.user
  User.findOne({ where: { id } })
    .then(user => user.newTurn(turn))
    .then(msg => {
      if (msg !== 'Turno creado exitosamente') return res.send(msg)
      Turn.findOne({where: {userId: id, branchId: turn.branchId}})
        .then(turn => {
          Branch.findByPk(turn.branchId)
            .then(branch => {
              //Crear una tarea para el envío del mail
              let diaAlert = new Date(turn.date);
              let hsAlert = turn.time.substring(0,2) + ":00"

              //Se resta un día a la fecha que tiene reservado el turno
              diaAlert = formatDate(diaAlert);
              let taskNewTurn = {process_date: diaAlert, process_time: hsAlert,
                                name: "Aviso por Email 24hs", email}
              Task.create(taskNewTurn);
              
              //Confirmación de la reserva de turno exitosa
              sgMail.send(emails.turnConfirmationEmail(email, turn, branch.name))
            })
        })
      res.status(201).send(msg)
    })
    .catch(next);
});

//
router.get("/disponibility/:branchId/:date", (req, res, next) => {
  const { branchId, date } = req.params
  Turn.findAll({ where: { branchId, date } })
    .then(turns => {
      if (!turns) return res.sendStatus(400)
      let disponibility = {}
      turns.map(turn => {
        if (disponibility[turn.time]) disponibility[turn.time]++
        else disponibility[turn.time] = 1
      })
      res.send(disponibility)
    })
    .catch(next)
});

//edicionq turno
router.put("/edit/:id", isSameUser, (req, res) => {
  Turn.findOne({ where: { userId: req.params.id, state: "pending" } })
    .then((turn) => {
      if (!turn) return res.status(400).send("No existe un turno activo")
      if (Date.parse(turn.date + " " + turn.time) + 7200000 < Date.now()) {
        return res.status(400).send("No se pueden editar turnos a menos de 2 horas de su horario")
      }
      turn.update({ time: req.body.time, date: req.body.date })
        .then(turn => {
          User.findByPk(turn.userId)
            .then(user => sgMail.send(emails.editedTurnEmail(user.email, turn)))
          res.status(202).send(turn)  
        })
    })
    .catch((err) => {
      console.log(err);
    });
});

//Cancela turno
router.put("/state/cancel/:id", isSameUserOrOpetator, (req, res) => {
  const { id } = req.params;
  Turn.findOne({ where: { userId: id, state: "pending" } })
    .then((turn) => {
      if (!turn) return res.status(400).send("No existe un turno activo")
      if (Date.parse(turn.date + " " + turn.time) - 7200000 < Date.now()) {
        return res.status(400).send("No se pueden cancelar turnos a menos de 2 horas de su horario")
      }
      turn.update({ state: "canceled" })
        .then(turn => {
          User.findByPk(turn.userId)
            .then(user => sgMail.send(emails.canceledTurnEmail(user.email, turn)))
          res.status(202).send(turn)
        })
    })
    .catch((err) => {
      console.log(err);
    });
});

// ****************************  Rutas para Administrador **************************//
//Actualización de state del turno
router.put("/state/:state/:userId", isOperator, (req, res) => {
  const { userId, state} = req.params;
  if (state !== "assisted" && state!== "missed" ) return res.sendStatus(400)
  Turn.update({ state }, { where: { userId, state: "pending" } })
  .then((turn) => {
    res.status(202).send(turn);
  })
  .catch((err) => {
    console.log(err);
  });
});

//Turnos por sucursal
router.get("/branch/:branchId", isOperator, (req, res) => {
  const { branchId } = req.params;
  Turn.findAll({ where: { branchId } }).then((turns) => {
    res.status(200).send(turns);
  });
});

//Turnos por sucursal de cierto dia
router.get("/branch/:branchId/:date", /* isOperator, */ (req, res) => {
  const { branchId , date } = req.params;
  Turn.findAll({
    where: { branchId, date },
    attributes: ['id', 'date', 'time', 'state'],
    include: {
      model: User,
      attributes: ['id', 'name', 'lastname', 'dni', 'email'],
    }
  }).then(turns => res.status(200).send(turns))
  .catch(console.log)
});

//Retorna un turno en particular
router.get("/:id", isOperator, (req, res) => {
  const { id } = req.params;
  Turn.findOne({ where: { id } })
    .then((turn) => {
      res.status(200).send(turn);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
const express = require("express");
const router = express.Router();
const { User, Turn } = require("../models");
const { isLogged, isOperator, isSameUser,isSameUserOrOpetator } = require("./utils");

//Turno (1) pending para un determinado Usuario

router.get("/pending/:userId", isLogged, (req, res) => {
    const { userId } = req.params;
    User.findOne({ where: { id: userId } })
      .then((user) => {
        Turn.findOne({ where: { userId, state: "pending" } }).then((turn) => {
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
  const { id } = req.user
  User.findOne({ where: { id } })
    .then(user => {
      user.newTurn(turn)
        .then(turn => res.send(turn))
    })
    .catch(next);
});


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

//Cancela turno
router.put("/cancel/:id", isSameUser, (req, res) => {
  Turn.findOne({ where: { userId: req.params.id } })
    .then((turn) => {
      if (Date.parse(turn.date + " " + turn.time) + 7200000 < Date.now()) {
        return res.status(400).send("No se pueden cancelar turnos a menos de 2 horas de su horario")
      }
      turn.update({ state: "canceled" })
        .then(turn => res.status(204).send(turn))
    })
    .catch((err) => {
      console.log(err);
    });
});

// ****************************  Rutas para Administrador **************************//
//Actualización de state del turno
router.put("/assist/:userId", isOperator, (req, res) => {
  const { userId } = req.params;
  Turn.update({ state: "assisted" }, { where: { userId } })
    .then((turn) => {
      res.send(turn);
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
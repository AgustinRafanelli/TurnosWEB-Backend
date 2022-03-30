const express = require("express");
const router = express.Router();
const { User, Turn } = require("../models");
const { isLogged, isOperator } = require("./utils");

//Turno (1) pending para un determinado Usuario
router.get("/pending/:userId", isLogged, (req, res) => {
  const { userId } = req.params;
  User.findByPk({ where: { userId } })
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
router.post("/", isLogged, (req, res) => {
  const turn = req.body;
  const { id } = req.user
  User.findOne({where: {id}})
    .then(user => {
      user.newTurn(turn)
        .then(turn => res.send(turn[0]))
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/disponibility/:branchId/:date", (req, res, next) => {
  const { branchId, date } = req.params
  Turn.findAll({ where: { branchId, date } })
    .then(turns => {
      if (!turns) return res.sendStatus(400)
      let disponibility = {}
      turns.map(turn => {
        if(disponibility[turn.time]) disponibility[turn.time]++
        else disponibility[turn.time] = 1
      })
      res.send(disponibility)
    })
    .catch(next)
});

// ****************************  Rutas para Administrador **************************//
//Actualización de state del turno
router.put("/:userId", isOperator, (req, res) => {
  const { state } = req.body;
  const { userId } = req.params;
  console.log(req.user)
  Turn.update(state, { where: { userId } })
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
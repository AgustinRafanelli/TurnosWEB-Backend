const express = require("express");
const routerTurn = express.Router();
const { User, Turn } = require("../models");
const { isLogged, isOperator } = require("./utils");

//Turno (1) pending para un determinado Usuario
routerTurn.get("/pending/:userId", isLogged, (req, res) => {
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
routerTurn.post("/", isLogged, (req, res) => {
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

routerTurn.get("/disponibility/:branchId/:date", (req, res, next) => {
  const { branchId, date } = req.params
  Turn.findAll({ where: { branchId, date } })
    .then(turns => {
      if (!turns) return res.sendStatus(400)
      res.send(turns)
    })
    .catch(next)
});

// ****************************  Rutas para Administrador **************************//
//Actualización de state del turno
routerTurn.put("/:userId", isOperator, (req, res) => {
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
routerTurn.get("/branch/:branchId", isOperator, (req, res) => {
  const { branchId } = req.params;
  Turn.findAll({ where: { branchId } }).then((turns) => {
    res.status(200).send(turns);
  });
});

//Retorna un turno en particular
routerTurn.get("/:id", isOperator, (req, res) => {
  const { id } = req.params;
  Turn.findOne({ where: { id } })
    .then((turn) => {
      res.status(200).send(turn);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = routerTurn;
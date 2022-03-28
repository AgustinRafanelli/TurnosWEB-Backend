const express = require("express");
const routerTurn = express.Router();

const { User, Turn } = require("../models/index");
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
  Turn.create(turn)
    .then((turn) => {
      res.send(turn);
    })
    .catch((err) => {
      console.log(err);
    });
});

// ****************************  Rutas para Administrador **************************//
//Actualización de state del turno

routerTurn.put("/branch/admin/:id", isOperator, (req, res) => {
  const { state } = req.body;
  const { turnId } = req.params;
  Turn.update(state, { where: { id: turnId } })
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

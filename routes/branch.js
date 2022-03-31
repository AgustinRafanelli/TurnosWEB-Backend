const express = require("express");
const router = express.Router();
const {Branch, User} = require("../models");
const { isLogged, isAdmin } = require("./utils");

router.post("/register", isAdmin, async (req, res) => {
  const userBody = {
    name: req.body.name ,
    lastname: "TurnosWEB",
    email: req.body.email ,
    dni: 11111111,
    role: "operator",
    password: req.body.password,
  }
  const brachBody = {
    name: req.body.name,  
    coords: req.body.coords ,
    maxPerTurn: req.body.maxPerTurn,
    turnRange: JSON.stringify(req.body.turnRange)
  }
  User.create(userBody)
    .then(user => {
      user.createBranch(brachBody)
        .then(branch => {
          res.sendStatus(204)
        })
    })
    .catch(err => res.status(400).send(err))
});

router.get("/all", async (req, res) => {
  const branchs = await Branch.findAll();
  return res.send(branchs);
});

router.get("/:id", (req, res, next) => {
  Branch.findByPk(req.params.id)
    .then(branch => {
      if(!branch) return res.sendStatus(400)  
      res.send(branch)
    })
    .catch(next)
});

router.delete("/:id", isAdmin, (req, res) => {
  Branch.destroy({ where: { id: req.params.id } });
  res.send("Sucursal eliminada");
});

router.get("/all",isLogged, async (req, res) => {
  const branchs = await Branch.findAll();
  res.send(branchs);
});

module.exports = router;
